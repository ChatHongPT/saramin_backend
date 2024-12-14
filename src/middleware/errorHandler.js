import Logger from '../utils/logger.js';
import { formatErrorResponse, handleDatabaseError } from '../utils/errorUtils.js';
import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  Logger.error(`${err.name}: ${err.message}`);
  Logger.error(`Stack: ${err.stack}`);

  // Handle Mongoose Validation Errors
  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({
      status: 'fail',
      message: 'Validation Error',
      errors
    });
  }

  // Handle Mongoose Cast Errors (Invalid ID)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      status: 'fail',
      message: '잘못된 데이터 형식입니다.'
    });
  }

  // Handle Database Errors
  if (err.name === 'MongoServerError') {
    const dbError = handleDatabaseError(err);
    return res.status(dbError.statusCode).json(formatErrorResponse(dbError));
  }

  // Handle JWT Errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'fail',
      message: '유효하지 않은 토큰입니다.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'fail',
      message: '토큰이 만료되었습니다.'
    });
  }

  // Handle operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json(formatErrorResponse(err));
  }

  // Handle programming errors in production
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      status: 'error',
      message: '서버 오류가 발생했습니다.'
    });
  }

  // Send detailed error in development
  return res.status(err.statusCode || 500).json(formatErrorResponse(err));
};