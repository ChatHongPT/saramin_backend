import { SearchHistory } from '../models/SearchHistory.js';

export class SearchHistoryService {
  async create(searchData) {
    return await SearchHistory.create(searchData);
  }

  async getUserSearchHistory(userId, limit = 10) {
    return await SearchHistory.find({ user: userId })
      .sort('-createdAt')
      .limit(limit);
  }
}