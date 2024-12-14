import { JobService } from '../services/JobService.js';
import { successResponse } from '../utils/responseUtils.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
  }

  // ... existing methods ...

  getJobById = async (req, res) => {
    const { id } = req.params;
    const { job, relatedJobs } = await this.jobService.getJobById(id);

    return successResponse(res, {
      data: {
        job,
        relatedJobs,
      },
    });
  };
}