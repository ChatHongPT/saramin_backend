import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { createSearchFilters } from '../utils/filters.js';
import { parseSkills, parseSalary } from '../utils/jobUtils.js';

export class JobService {
  // ... existing methods ...

  async filterJobs(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = '-createdAt' } = options;
      const query = { status: 'active' };

      // Location filter
      if (filters.location) {
        query.location = new RegExp(filters.location, 'i');
      }

      // Experience filter
      if (filters.experience) {
        const [min, max] = filters.experience.split('-').map(Number);
        if (!isNaN(min)) query['experience.min'] = { $gte: min };
        if (!isNaN(max)) query['experience.max'] = { $lte: max };
      }

      // Salary filter
      if (filters.salary) {
        const [min, max] = filters.salary.split('-').map(Number);
        if (!isNaN(min)) query['salary.min'] = { $gte: min };
        if (!isNaN(max)) query['salary.max'] = { $lte: max };
      }

      // Skills filter
      if (filters.skills) {
        const skillsList = parseSkills(filters.skills);
        if (skillsList.length > 0) {
          query['skills.name'] = { $in: skillsList };
        }
      }

      // Sort options
      let sortOption = {};
      switch (sort) {
        case 'salary':
          sortOption = { 'salary.min': -1 };
          break;
        case 'views':
          sortOption = { views: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
      }

      const [jobs, total] = await Promise.all([
        Job.find(query)
          .populate('company')
          .sort(sortOption)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Job.countDocuments(query)
      ]);

      return { jobs, total };
    } catch (error) {
      throw new ApiError(500, '채용공고 필터링 중 오류가 발생했습니다.');
    }
  }
}