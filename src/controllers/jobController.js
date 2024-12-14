import { JobService } from '../services/JobService.js';
import { successResponse } from '../utils/responseUtils.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
  }

  // 채용공고 목록 조회
  getJobs = async (req, res) => {
    const { 
      page = 1, 
      limit = 20,
      sort = '-createdAt',
      location,
      experience,
      salary,
      skills,
      keyword,
      company
    } = req.query;

    const filters = {
      location,
      experience,
      salary,
      skills,
      keyword,
      company
    };

    const { jobs, total } = await this.jobService.getJobs(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });

    return successResponse(res, {
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  };

  // 채용공고 상세 조회
  getJobById = async (req, res) => {
    const { id } = req.params;
    const { withRecommendations = true } = req.query;

    const result = await this.jobService.getJobById(id, { withRecommendations });

    return successResponse(res, {
      data: result
    });
  };
}