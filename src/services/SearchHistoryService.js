import { SearchHistory } from '../models/SearchHistory.js';

export class SearchHistoryService {
  async createSearchHistory(userId, searchData) {
    try {
      const history = await SearchHistory.create({
        user: userId,
        query: searchData.query,
        filters: {
          company: searchData.filters.company,
          location: searchData.filters.location,
          experience: searchData.filters.experience,
          salary: searchData.filters.salary,
          skills: searchData.filters.skills,
        },
        results: {
          count: searchData.results.count,
          relevance: searchData.results.relevance
        }
      });
      return history;
    } catch (error) {
      console.error('Failed to save search history:', error);
      // Don't throw error to prevent affecting the main search functionality
      return null;
    }
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