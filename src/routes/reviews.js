import express from 'express';
import { ReviewController } from '../controllers/reviewController.js';
import { authenticate } from '../middleware/auth.js';
import { validateReview } from '../middleware/validators/reviewValidators.js';
import { validateId, validatePagination } from '../middleware/validators/common/index.js';

export const router = express.Router();
const reviewController = new ReviewController();

// Public routes
router.get('/', validatePagination, reviewController.getReviews);

// Protected routes
router.use(authenticate);
router.post('/', validateReview, reviewController.createReview);
router.put('/:id', validateId, validateReview, reviewController.updateReview);
router.delete('/:id', validateId, reviewController.deleteReview);