import express from 'express';
import { SearchHistoryController } from '../controllers/searchHistoryController.js';
import { authenticate } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validators/common/index.js';

export const router = express.Router();
const searchHistoryController = new SearchHistoryController();

// All routes require authentication
router.use(authenticate);

// Get user's search history
router.get('/', validatePagination, searchHistoryController.getSearchHistory);

// Clear search history
router.delete('/', searchHistoryController.clearSearchHistory);

export default router;