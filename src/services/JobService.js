import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { parseSkills, parseExperience, parseSalary, createSortOption } from '../utils/jobUtils.js';

export class JobService {
  async getJobs(options = {}) {
    const { page = 1, limit = 20 } = options;
    const query = { status: 'active' };

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query)
    ]);

    return { jobs, total };
  }

  async filterJobs(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = 'latest' } = options;
      const query = { status: 'active' };

      // Location filter
      if (filters.location) {
        query.location = new RegExp(filters.location, 'i');
      }

      // Experience filter
      if (filters.experience) {
        const exp = parseExperience(filters.experience);
        if (exp) {
          query['experience.min'] = { $gte: exp.min };
          if (exp.max) query['experience.max'] = { $lte: exp.max };
        }
      }

      // Salary filter
      if (filters.salary) {
        const sal = parseSalary(filters.salary);
        if (sal) {
          query['salary.min'] = { $gte: sal.min };
          if (sal.max) query['salary.max'] = { $lte: sal.max };
        }
      }

      // Skills filter
      if (filters.skills) {
        const skillsList = parseSkills(filters.skills);
        if (skillsList.length > 0) {
          query['skills.name'] = { $in: skillsList };
        }
      }

      const sortOption = createSortOption(sort);

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

  async searchJobs(keyword, options = {}) {
    const { page = 1, limit = 20 } = options;
    const query = {
      status: 'active',
      $or: [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') }
      ]
    };

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('company')
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Job.countDocuments(query)
    ]);

    return { jobs, total };
  }

  // ... other methods ...
}