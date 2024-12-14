import express from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { validateReview } from '../middleware/validators/reviewValidators.js';
import {
  validateId,
  validatePagination,
} from '../middleware/validators/common/index.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

export const router = express.Router();
const reviewController = new ReviewController();
const controller = asyncWrapper(reviewController);

// Public routes
router.get('/', validatePagination, controller.getReviews);
router.get('/:id', validateId, controller.getReviewById);

// Protected routes
router.use(authenticate);
router.post('/', validateReview, controller.createReview);
router.put('/:id', validateId, validateReview, controller.updateReview);
router.delete('/:id', validateId, controller.deleteReview);

// Helpful marking routes
router.post('/:id/helpful', validateId, controller.markHelpful);
router.delete('/:id/helpful', validateId, controller.unmarkHelpful);
