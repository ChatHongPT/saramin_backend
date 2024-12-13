import { JobService } from '../services/JobService.js';
import { BookmarkService } from '../services/BookmarkService.js';
import { ApiError } from '../utils/ApiError.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.bookmarkService = new BookmarkService();
  }

  getJobs = async (req, res, next) => {
    try {
      const { 
        page = 1, 
        limit = 20, 
        sort = '-createdAt',
        location,
        experience,
        skills,
        type
      } = req.query;

      const filters = {
        location,
        experience,
        skills: skills?.split(','),
        type
      };

      const { jobs, total } = await this.jobService.getJobs(filters, {
        page: parseInt(page),
        limit: parseInt(limit),
        sort
      });

      res.json({
        status: 'success',
        data: jobs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getJobById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const job = await this.jobService.getJobById(id);
      await this.jobService.incrementViews(id);

      res.json({
        status: 'success',
        data: job
      });
    } catch (error) {
      next(error);
    }
  };

  searchJobs = async (req, res, next) => {
    try {
      const { 
        keyword,
        page = 1, 
        limit = 20,
        location,
        experience,
        skills,
        type
      } = req.query;

      if (!keyword) {
        throw new ApiError(400, '검색어를 입력해주세요.');
      }

      const filters = {
        location,
        experience,
        skills: skills?.split(','),
        type
      };

      const { jobs, total } = await this.jobService.searchJobs(keyword, filters, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        status: 'success',
        data: jobs,
        pagination: {
          total,
          pages: Math.ceil(total / limit),
          page: parseInt(page),
          limit: parseInt(limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  bookmarkJob = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const bookmark = await this.bookmarkService.addBookmark(userId, id);

      res.json({
        status: 'success',
        message: '북마크가 추가되었습니다.',
        data: bookmark
      });
    } catch (error) {
      next(error);
    }
  };

  removeBookmark = async (req, res, next) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      await this.bookmarkService.removeBookmark(userId, id);

      res.json({
        status: 'success',
        message: '북마크가 제거되었습니다.'
      });
    } catch (error) {
      next(error);
    }
  };

  getBookmarks = async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 20 } = req.query;

      const { bookmarks, pagination } = await this.bookmarkService.getUserBookmarks(userId, {
        page: parseInt(page),
        limit: parseInt(limit)
      });

      res.json({
        status: 'success',
        data: bookmarks,
        pagination
      });
    } catch (error) {
      next(error);
    }
  };
}