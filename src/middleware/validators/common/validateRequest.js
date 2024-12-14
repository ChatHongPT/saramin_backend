import { validationResult } from 'express-validator';
import { ValidationError } from '../../../utils/errors/ValidationError.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map(err => err.msg);
    throw new ValidationError(messages.join(', '));
  }
  next();
};