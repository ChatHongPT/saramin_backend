import { JobService } from '../services/JobService.js';
import { BookmarkService } from '../services/BookmarkService.js';
import { SearchHistoryService } from '../services/SearchHistoryService.js';
import { successResponse } from '../utils/responseUtils.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.bookmarkService = new BookmarkService();
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

    // Save search history if user is authenticated and has a search query
    if (req.user && (keyword || company || location || experience || salary || skills)) {
      await this.searchHistoryService.createSearchHistory(req.user.id, {
        query: keyword || '',
        filters: {
          company,
          location,
          experience,
          salary,
          skills: skills?.split(','),
        },
        results: {
          count: total,
          relevance: 1.0
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