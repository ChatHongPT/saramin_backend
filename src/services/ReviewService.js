import { Review } from '../models/Review.js';
import { Job } from '../models/Job.js';
import { NotFoundError, BusinessError } from '../utils/errors/index.js';

export class ReviewService {
  async createReview(userId, reviewData) {
    const job = await Job.findById(reviewData.job).populate('company');
    if (!job) {
      throw new NotFoundError('채용공고');
    }

    // 이미 리뷰를 작성했는지 확인
    const existingReview = await Review.findOne({
      user: userId,
      job: reviewData.job,
    });

    if (existingReview) {
      throw new BusinessError('이미 리뷰를 작성했습니다.');
    }

    const review = await Review.create({
      ...reviewData,
      user: userId,
      company: job.company._id,
    });

    return review.populate(['user', 'job', 'company']);
  }

  async getReviews(filters = {}, options = {}) {
    const { page = 1, limit = 20, sort = '-createdAt' } = options;
    const query = { status: 'approved', ...filters };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate(['user', 'job', 'company'])
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Review.countDocuments(query),
    ]);

    return { reviews, total };
  }

  async getReviewById(id) {
    const review = await Review.findById(id).populate([
      'user',
      'job',
      'company',
    ]);

    if (!review) {
      throw new NotFoundError('리뷰');
    }

    return review;
  }

  async updateReview(id, userId, updateData) {
    const review = await Review.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true }
    ).populate(['user', 'job', 'company']);

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

  async markHelpful(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('리뷰');
    }

    if (review.helpfulUsers.includes(userId)) {
      throw new BusinessError('이미 도움됨으로 표시했습니다.');
    }

    review.helpfulUsers.push(userId);
    review.helpfulCount += 1;
    await review.save();

    return review;
  }

  async unmarkHelpful(reviewId, userId) {
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new NotFoundError('리뷰');
    }

    const index = review.helpfulUsers.indexOf(userId);
    if (index === -1) {
      throw new BusinessError('도움됨 표시를 하지 않았습니다.');
    }

    review.helpfulUsers.splice(index, 1);
    review.helpfulCount -= 1;
    await review.save();

    return review;
  }
}
