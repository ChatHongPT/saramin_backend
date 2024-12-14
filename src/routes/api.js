import express from 'express';
import { router as userRouter } from './users.js';
import { router as authRouter } from './auth.js';
import { router as jobRouter } from './jobs.js';
import { router as applicationRouter } from './applications.js';
import { router as resumeRouter } from './resumes.js';
import { router as reviewRouter } from './reviews.js';
import { router as searchHistoryRouter } from './searchHistory.js';

export const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Mount routes
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/jobs', jobRouter);
router.use('/applications', applicationRouter);
router.use('/resumes', resumeRouter);
router.use('/reviews', reviewRouter);
router.use('/search-history', searchHistoryRouter);