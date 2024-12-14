import { JobService } from '../services/JobService.js';
import { BookmarkService } from '../services/BookmarkService.js';
import { successResponse, paginatedResponse } from '../utils/responseUtils.js';
import { NotFoundError, BusinessError } from '../utils/errors/index.js';

export class JobController {
  constructor() {
    this.jobService = new JobService();
    this.bookmarkService = new BookmarkService();
  }

  getJobs = async (req, res) => {
    const {
      page = 1,
      limit = 20,
      sort = '-createdAt',
      location,
      experience,
      skills,
      type,
    } = req.query;

    const filters = {
      location,
      experience,
      skills: skills?.split(','),
      type,
    };

    const { jobs, total } = await this.jobService.getJobs(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    });

    return paginatedResponse(res, {
      items: jobs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  };

  getJobById = async (req, res) => {
    const { id } = req.params;
    const job = await this.jobService.getJobById(id);

    if (!job) {
      throw new NotFoundError('채용공고');
    }

    await this.jobService.incrementViews(id);
    return successResponse(res, { data: job });
  };

  createJob = async (req, res) => {
    const jobData = req.body;
    const job = await this.jobService.create(jobData);
    return successResponse(res, {
      statusCode: 201,
      message: '채용공고가 등록되었습니다.',
      data: job,
    });
  };

  updateJob = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    const job = await this.jobService.update(id, updateData);
    return successResponse(res, {
      message: '채용공고가 수정되었습니다.',
      data: job,
    });
  };

  deleteJob = async (req, res) => {
    const { id } = req.params;
    await this.jobService.delete(id);
    return successResponse(res, {
      message: '채용공고가 삭제되었습니다.',
    });
  };

  searchJobs = async (req, res) => {
    const {
      keyword,
      page = 1,
      limit = 20,
      location,
      experience,
      skills,
      type,
    } = req.query;

    if (!keyword) {
      throw new BusinessError('검색어를 입력해주세요.');
    }

    const filters = {
      location,
      experience,
      skills: skills?.split(','),
      type,
    };

    const { jobs, total } = await this.jobService.searchJobs(keyword, filters, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return paginatedResponse(res, {
      items: jobs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  };

  bookmarkJob = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const bookmark = await this.bookmarkService.addBookmark(userId, id);
    return successResponse(res, {
      message: '북마크가 추가되었습니다.',
      data: bookmark,
    });
  };

  removeBookmark = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.bookmarkService.removeBookmark(userId, id);
    return successResponse(res, {
      message: '북마크가 제거되었습니다.',
    });
  };

  getBookmarks = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const { bookmarks, pagination } =
      await this.bookmarkService.getUserBookmarks(userId, {
        page: parseInt(page),
        limit: parseInt(limit),
      });

    return successResponse(res, {
      data: bookmarks,
      pagination,
    });
  };
}
