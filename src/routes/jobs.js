import express from 'express';
import { JobController } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { validateJobSearch, validateJobFilters } from '../middleware/validators/jobValidators.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

export const router = express.Router();
const jobController = new JobController();

// Public routes
router.get('/', validateJobSearch, asyncWrapper(jobController.getJobs));
router.get('/search', validateJobSearch, asyncWrapper(jobController.searchJobs));
router.get('/filter', validateJobFilters, asyncWrapper(jobController.filterJobs));
router.get('/:id', asyncWrapper(jobController.getJobById));

// Protected routes
router.use(authenticate);
router.post('/:id/bookmark', asyncWrapper(jobController.bookmarkJob));
router.delete('/:id/bookmark', asyncWrapper(jobController.removeBookmark));
router.get('/bookmarks/list', asyncWrapper(jobController.getBookmarks));

export default router;