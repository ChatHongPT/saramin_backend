import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';
import { createSearchFilters } from '../utils/filters.js';
import { SalaryParser } from '../utils/salaryParser.js';

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

      const [jobs, total] = await Promise.all([
        Job.find(query)
          .populate('company')
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        Job.countDocuments(query)
      ]);

      // Parse salary information
      jobs.forEach(job => {
        if (job.salary) {
          job.salary = SalaryParser.parse(job.salary.text);
        }
      });

      return { jobs, total };
    } catch (error) {
      throw new ApiError(500, '채용공고 조회 중 오류가 발생했습니다.');
    }
  }

  async getJobById(id) {
    try {
      const job = await Job.findById(id).populate('company');
      if (!job) {
        throw new ApiError(404, '채용공고를 찾을 수 없습니다.');
      }

      // Increment view count
      await job.incrementViews();

      // Get recommended jobs
      const recommendations = await this.getRecommendedJobs(job);

      return {
        job,
        recommendations
      };
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

  async exists(link) {
    if (!link || typeof link !== 'string') {
      throw new ApiError(400, '유효하지 않은 링크입니다.');
    }
    return await Job.exists({ link });
  }
}