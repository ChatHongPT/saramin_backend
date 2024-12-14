import { SearchHistory } from '../models/SearchHistory.js';

export class SearchHistoryService {
  async createSearchHistory(userId, searchData) {
    const history = await SearchHistory.create({
      user: userId,
      ...searchData
    });
    return history;
  }

  async getUserSearchHistory(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    const [history, total] = await Promise.all([
      SearchHistory.find({ user: userId })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      SearchHistory.countDocuments({ user: userId })
    ]);

    return { history, total };
  }

  async clearUserSearchHistory(userId) {
    await SearchHistory.deleteMany({ user: userId });
  }
}