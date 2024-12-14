import express from 'express';
import { JobController } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { validateJobSearch, validateJobFilters } from '../middleware/validators/jobValidators.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

export const router = express.Router();
const jobController = new JobController();

// Wrap controller methods with asyncWrapper
const wrappedController = {
  getJobs: asyncWrapper(jobController.getJobs),
  searchJobs: asyncWrapper(jobController.searchJobs),
  getJobById: asyncWrapper(jobController.getJobById),
  filterJobs: asyncWrapper(jobController.filterJobs),
  bookmarkJob: asyncWrapper(jobController.bookmarkJob),
  removeBookmark: asyncWrapper(jobController.removeBookmark),
  getBookmarks: asyncWrapper(jobController.getBookmarks),
};

// Public routes
router.get('/', validateJobSearch, wrappedController.getJobs);
router.get('/search', validateJobSearch, wrappedController.searchJobs);
router.get('/filter', validateJobFilters, wrappedController.filterJobs);
router.get('/:id', wrappedController.getJobById);

// Protected routes
router.use(authenticate);
router.post('/:id/bookmark', wrappedController.bookmarkJob);
router.delete('/:id/bookmark', wrappedController.removeBookmark);
router.get('/bookmarks/list', wrappedController.getBookmarks);

export default router;