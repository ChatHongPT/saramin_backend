import { SearchHistory } from '../models/SearchHistory.js';

export class SearchHistoryService {
  async createSearchHistory(userId, searchData) {
    try {
      const history = await SearchHistory.create({
        user: userId,
        query: searchData.query,
        filters: {
          location: searchData.filters?.location,
          skills: searchData.filters?.skills,
          experience: searchData.filters?.experience,
          salary: searchData.filters?.salary,
          jobType: searchData.filters?.jobType,
          company: searchData.filters?.company,
        },
        results: {
          count: searchData.results?.count || 0,
        }
      });
      return history;
    } catch (error) {
      console.error('Failed to create search history:', error);
      throw error;
    }
  }

  async getUserSearchHistory(userId, options = {}) {
    const { page = 1, limit = 20 } = options;

    try {
      const [history, total] = await Promise.all([
        SearchHistory.find({ user: userId })
          .sort('-createdAt')
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
        SearchHistory.countDocuments({ user: userId })
      ]);

      return { history, total };
    } catch (error) {
      console.error('Failed to get search history:', error);
      throw error;
    }
  }

  async clearUserSearchHistory(userId) {
    try {
      await SearchHistory.deleteMany({ user: userId });
    } catch (error) {
      console.error('Failed to clear search history:', error);
      throw error;
    }
  }
}