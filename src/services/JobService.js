import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { createSearchFilters, createSortOption } from '../utils/jobUtils.js';

export class JobService {
  async getJobs(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = '-createdAt' } = options;
      const query = { status: 'active' };

      // Apply search filters
      if (filters.keyword) {
        query.$or = [
          { title: new RegExp(filters.keyword, 'i') },
          { description: new RegExp(filters.keyword, 'i') }
        ];
      }

      // Apply company filter
      if (filters.company) {
        query['company.name'] = new RegExp(filters.company, 'i');
      }

      // Apply other filters
      const searchFilters = createSearchFilters(filters);
      Object.assign(query, searchFilters);

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
      throw new ApiError(500, '채용공고 조회 중 오류가 발생했습니다.');
    }
  }

  async getJobById(id, options = {}) {
    try {
      const job = await Job.findById(id).populate('company');
      if (!job) {
        throw new ApiError(404, '채용공고를 찾을 수 없습니다.');
      }

      // Increment view count
      job.views += 1;
      await job.save();

      const result = { job };

      // Get recommended jobs if requested
      if (options.withRecommendations) {
        const recommendations = await this.getRecommendedJobs(job);
        result.recommendations = recommendations;
      }

      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, '채용공고 조회 중 오류가 발생했습니다.');
    }
  }

  async getRecommendedJobs(job, limit = 5) {
    // Find jobs with similar attributes
    const query = {
      _id: { $ne: job._id },
      status: 'active',
      $or: [
        { 'company._id': job.company._id }, // Same company
        { 
          $and: [
            { location: job.location }, // Same location
            { 'skills.name': { $in: job.skills.map(s => s.name) } } // Similar skills
          ]
        }
      ]
    };

    return await Job.find(query)
      .populate('company')
      .limit(limit)
      .lean();
  }
}