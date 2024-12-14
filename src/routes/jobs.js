import express from 'express';
import { JobController } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { validateJobSearch, validateJobCreate, validateJobUpdate } from '../middleware/validators/jobValidators.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

export const router = express.Router();
const jobController = new JobController();

// Wrap all controller methods with asyncWrapper
const controller = asyncWrapper(jobController);

// Public routes
router.get('/', validateJobSearch, controller.getJobs);
router.get('/search', validateJobSearch, controller.searchJobs);
router.get('/:id', controller.getJobById);

// Protected routes (require authentication)
router.post('/', authenticate, validateJobCreate, controller.createJob);
router.put('/:id', authenticate, validateJobUpdate, controller.updateJob);
router.delete('/:id', authenticate, controller.deleteJob);

// Bookmark routes
router.post('/:id/bookmark', authenticate, controller.bookmarkJob);
router.delete('/:id/bookmark', authenticate, controller.removeBookmark);
router.get('/bookmarks/list', authenticate, controller.getBookmarks);