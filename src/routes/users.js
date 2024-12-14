import express from 'express';
import { UserController } from '../controllers/userController.js';

export const router = express.Router();
const userController = new UserController();

// User routes
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
