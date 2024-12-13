import express from 'express';
import { router as userRouter } from './users.js';
import { router as authRouter } from './auth.js';
import { router as jobRouter } from './jobs.js';

export const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Mount routes
router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/jobs', jobRouter);