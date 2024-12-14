import { Review } from '../models/Review.js';
import { NotFoundError, BusinessError } from '../utils/errors/index.js';

export class ReviewService {
  async createReview(userId, reviewData) {
    const existingReview = await Review.findOne({
      user: userId,
      company: reviewData.company,
    });

    if (existingReview) {
      throw new BusinessError('이미 리뷰를 작성했습니다.');
    }

    const review = await Review.create({
      ...reviewData,
      user: userId,
    });

    return review.populate(['user', 'company']);
  }

  async getReviews(filters = {}, options = {}) {
    const { page = 1, limit = 20 } = options;
    const query = { ...filters };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate(['user', 'company'])
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(query),
    ]);

    return { reviews, total };
  }

  async updateReview(id, userId, updateData) {
    const review = await Review.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    ).populate(['user', 'company']);

    if (!review) {
      throw new NotFoundError('리뷰');
    }

    return review;
  }

  async deleteReview(id, userId) {
    const review = await Review.findOneAndDelete({ _id: id, user: userId });
    if (!review) {
      throw new NotFoundError('리뷰');
    }
  }
}