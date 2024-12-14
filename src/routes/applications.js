import express from 'express';
import { ApplicationController } from '../controllers/applicationController.js';
import { authenticate } from '../middleware/auth.js';
import { validateApplication } from '../middleware/validators/applicationValidators.js';

export const router = express.Router();
const applicationController = new ApplicationController();

// Protected routes (require authentication)
router.post('/', authenticate, validateApplication, applicationController.apply);
router.get('/', authenticate, applicationController.getMyApplications);
router.get('/:id', authenticate, applicationController.getApplicationById);
router.delete('/:id', authenticate, applicationController.cancelApplication);