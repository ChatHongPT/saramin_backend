import { BookmarkService } from '../services/BookmarkService.js';
import { successResponse } from '../utils/responseUtils.js';

export class BookmarkController {
  constructor() {
    this.bookmarkService = new BookmarkService();
  }

  createBookmark = async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.body;
    
    const bookmark = await this.bookmarkService.addBookmark(userId, jobId);
    return successResponse(res, {
      statusCode: 201,
      message: '북마크가 추가되었습니다.',
      data: bookmark
    });
  };

  getBookmarks = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;
    
    const { bookmarks, pagination } = await this.bookmarkService.getUserBookmarks(userId, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    return successResponse(res, {
      data: bookmarks,
      pagination
    });
  };

  removeBookmark = async (req, res) => {
    const userId = req.user.id;
    const { jobId } = req.params;
    
    await this.bookmarkService.removeBookmark(userId, jobId);
    return successResponse(res, {
      message: '북마크가 제거되었습니다.'
    });
  };
}