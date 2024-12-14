import { JobService } from '../services/JobService.js';
import { SearchHistoryService } from '../services/SearchHistoryService.js';
import { successResponse } from '../utils/responseUtils.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.searchHistoryService = new SearchHistoryService();
  }

  getJobs = async (req, res) => {
    const { 
      page = 1, 
      limit = 20,
      sort = 'latest',
      keyword,
      company,
      location,
      experience,
      salary,
      skills
    } = req.query;

    const filters = {
      keyword,
      company,
      location,
      experience,
      salary,
      skills
    };

    const { jobs, total } = await this.jobService.getJobs(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    });

    // Save search history if user is authenticated and using search/filters
    if (req.user && (keyword || company || location || experience || salary || skills)) {
      await this.searchHistoryService.createSearchHistory(req.user.id, {
        query: keyword || '',
        filters: {
          company,
          location,
          experience,
          salary: salary ? {
            min: parseInt(salary.split('-')[0]),
            max: parseInt(salary.split('-')[1])
          } : null,
          skills: skills ? skills.split(',').map(s => s.trim()) : [],
          jobType: filters.type
        },
        results: {
          count: total
        }
      });
    }

    return successResponse(res, {
      data: jobs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  };

  // ... other methods ...
}