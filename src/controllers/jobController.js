import { JobService } from '../services/JobService.js';
import { BookmarkService } from '../services/BookmarkService.js';
import { successResponse } from '../utils/responseUtils.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.bookmarkService = new BookmarkService();
  }

  // ... existing methods ...

  filterJobs = async (req, res) => {
    const { 
      page = 1, 
      limit = 20,
      location,
      experience,
      salary,
      skills,
      sort = '-createdAt'
    } = req.query;

    const { jobs, total } = await this.jobService.filterJobs({
      location,
      experience,
      salary,
      skills,
      sort
    }, {
      page: parseInt(page),
      limit: parseInt(limit)
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
}