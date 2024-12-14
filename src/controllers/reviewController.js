import { ReviewService } from '../services/ReviewService.js';
import { successResponse } from '../utils/responseUtils.js';

export class ReviewController {
  constructor() {
    this.reviewService = new ReviewService();
  }

  createReview = async (req, res) => {
    const userId = req.user.id;
    const reviewData = req.body;
    const review = await this.reviewService.createReview(userId, reviewData);
    
    return successResponse(res, {
      statusCode: 201,
      message: '리뷰가 작성되었습니다.',
      data: review,
    });
  };

  getReviews = async (req, res) => {
    const { page, limit, company } = req.query;
    const filters = company ? { company } : {};
    
    const { reviews, total } = await this.reviewService.getReviews(filters, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    return successResponse(res, {
      data: reviews,
      pagination: {
        total,
        page: parseInt(page) || 1,
        limit: parseInt(limit) || 20,
      },
    });
  };

  updateReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;
    
    const review = await this.reviewService.updateReview(id, userId, updateData);
    return successResponse(res, {
      message: '리뷰가 수정되었습니다.',
      data: review,
    });
  };

  deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    
    await this.reviewService.deleteReview(id, userId);
    return successResponse(res, {
      message: '리뷰가 삭제되었습니다.',
    });
  };
}