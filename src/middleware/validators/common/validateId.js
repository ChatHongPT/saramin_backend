import { param } from 'express-validator';
import { validateRequest } from './validateRequest.js';

export const validateId = [
  param('id').isMongoId().withMessage('유효하지 않은 ID 형식입니다.'),
  validateRequest,
];
