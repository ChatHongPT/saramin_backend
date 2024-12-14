import { SearchHistoryService } from '../services/SearchHistoryService.js';
import { successResponse } from '../utils/responseUtils.js';

export class SearchHistoryController {
  constructor() {
    this.searchHistoryService = new SearchHistoryService();
  }

  getSearchHistory = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const { history, total } = await this.searchHistoryService.getUserSearchHistory(
      userId,
      {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    );

    return successResponse(res, {
      data: history,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  };

  clearSearchHistory = async (req, res) => {
    const userId = req.user.id;
    await this.searchHistoryService.clearUserSearchHistory(userId);

    return successResponse(res, {
      message: '검색 기록이 삭제되었습니다.'
    });
  };
}