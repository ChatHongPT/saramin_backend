import { ReviewService } from '../services/ReviewService.js';
import { successResponse, paginatedResponse } from '../utils/responseUtils.js';

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
      data: review
    });
  };

  getReviews = async (req, res) => {
    const { page = 1, limit = 20, company, job } = req.query;
    const filters = {};

    if (company) filters.company = company;
    if (job) filters.job = job;

    const { reviews, total } = await this.reviewService.getReviews(filters, {
      page: parseInt(page),
      limit: parseInt(limit)
    });

    return paginatedResponse(res, {
      items: reviews,
      total,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  };

  getReviewById = async (req, res) => {
    const { id } = req.params;
    const review = await this.reviewService.getReviewById(id);
    return successResponse(res, { data: review });
  };

  updateReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const updateData = req.body;

    const review = await this.reviewService.updateReview(id, userId, updateData);
    return successResponse(res, {
      message: '리뷰가 수정되었습니다.',
      data: review
    });
  };

  deleteReview = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    await this.reviewService.deleteReview(id, userId);
    return successResponse(res, {
      message: '리뷰가 삭제되었습니다.'
    });
  };

  markHelpful = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await this.reviewService.markHelpful(id, userId);
    return successResponse(res, {
      message: '리뷰가 도움됨으로 표시되었습니다.',
      data: review
    });
  };

  unmarkHelpful = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const review = await this.reviewService.unmarkHelpful(id, userId);
    return successResponse(res, {
      message: '리뷰의 도움됨 표시가 취소되었습니다.',
      data: review
    });
  };
}