import { validationResult } from 'express-validator';
import { ApiError } from './ApiError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new ApiError(400, errorMessages.join(', '));
  }
  next();
};