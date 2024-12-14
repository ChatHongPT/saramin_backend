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

  // 채용공고 목록 조회
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

    // 검색 기록 저장 (키워드 검색인 경우)
    if (keyword && req.user) {
      await this.searchHistoryService.createSearchHistory(req.user.id, {
        query: keyword,
        filters: {
          location,
          experience,
          salary,
          skills: skills?.split(','),
        },
        results: {
          count: total,
          relevance: 1.0 // 기본값
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

  // 채용공고 상세 조회
  getJobById = async (req, res) => {
    const { id } = req.params;
    const { withRecommendations = true } = req.query;

    const result = await this.jobService.getJobById(id, {
      withRecommendations: withRecommendations === 'true'
    });

    return successResponse(res, {
      data: result
    });
  };

  // 북마크 추가
  bookmarkJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const bookmark = await this.bookmarkService.addBookmark(userId, id);
    return successResponse(res, {
      message: '북마크가 추가되었습니다.',
      data: bookmark
    });
  };

  // 북마크 제거
  removeBookmark = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.bookmarkService.removeBookmark(userId, id);
    return successResponse(res, {
      message: '북마크가 제거되었습니다.'
    });
  };

  // 북마크 목록 조회
  getBookmarks = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const { bookmarks, pagination } = await this.bookmarkService.getUserBookmarks(
      userId,
      {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    );

    return successResponse(res, {
      data: bookmarks,
      pagination
    });
  };
}