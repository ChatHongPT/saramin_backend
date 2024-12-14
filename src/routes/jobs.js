import express from 'express';
import { JobController } from '../controllers/jobController.js';
import { authenticate } from '../middleware/auth.js';
import { validateJobSearch } from '../middleware/validators/jobValidators.js';

export const router = express.Router();
const jobController = new JobController();

// Public routes
router.get('/', validateJobSearch, jobController.getJobs);
router.get('/search', validateJobSearch, jobController.searchJobs);
router.get('/:id', jobController.getJobById);

// Protected routes
router.use(authenticate);
router.post('/:id/bookmark', jobController.bookmarkJob);
router.delete('/:id/bookmark', jobController.removeBookmark);
router.get('/bookmarks/list', jobController.getBookmarks);