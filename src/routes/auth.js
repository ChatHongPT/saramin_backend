import express from 'express';
import { AuthController } from '../controllers/authController.js';
import {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
} from '../middleware/validators/authValidators.js';
import { authenticate } from '../middleware/auth.js';

export const router = express.Router();
const authController = new AuthController();

// Auth routes
router.post('/register', validateRegistration, authController.register);
router.post('/login', validateLogin, authController.login);
router.post('/refresh', authController.refreshToken);
router.put(
  '/profile',
  authenticate,
  validateProfileUpdate,
  authController.updateProfile
);
router.get('/profile', authenticate, authController.getProfile);
router.delete('/profile', authenticate, authController.deleteAccount);
