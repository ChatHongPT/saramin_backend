import { Bookmark } from '../models/Bookmark.js';
import { Job } from '../models/Job.js';
import { ApiError } from '../utils/ApiError.js';

export class BookmarkService {
  async addBookmark(userId, jobId) {
    // 채용공고 존재 여부 확인
    const job = await Job.findById(jobId);
    if (!job) {
      throw new ApiError(404, '채용 공고를 찾을 수 없습니다.');
    }

    // 이미 북마크한 경우 체크
    const existingBookmark = await Bookmark.findOne({
      user: userId,
      job: jobId,
    });
    if (existingBookmark) {
      throw new ApiError(400, '이미 북마크한 채용공고입니다.');
    }

    // 북마크 생성
    const bookmark = await Bookmark.create({
      user: userId,
      job: jobId,
    });

    return bookmark;
  }

  async removeBookmark(userId, jobId) {
    const result = await Bookmark.findOneAndDelete({
      user: userId,
      job: jobId,
    });

    if (!result) {
      throw new ApiError(404, '북마크를 찾을 수 없습니다.');
    }
  }

  async getUserBookmarks(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    const bookmarks = await Bookmark.find({ user: userId })
      .populate('job')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Bookmark.countDocuments({ user: userId });

    return {
      bookmarks,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    };
  }
}
