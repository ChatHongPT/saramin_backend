import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { createSearchFilters, createSortOption } from '../utils/jobUtils.js';

export class JobService {
  async getJobs(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 20, sort = 'latest' } = options;
      const query = createSearchFilters(filters);
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
      await job.incrementViews();

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
    const query = {
      _id: { $ne: job._id },
      status: 'active',
      $or: [
        { 'company._id': job.company._id },
        { 
          $and: [
            { location: job.location },
            { 'skills.name': { $in: job.skills.map(s => s.name) } }
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