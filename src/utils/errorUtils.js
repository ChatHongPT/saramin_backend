import Logger from './logger.js';
import { DatabaseError } from './errors/DatabaseError.js';

export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const handleDatabaseError = (error) => {
  Logger.error('Database Error:', error);
  
  if (error.name === 'MongoServerError') {
    switch (error.code) {
      case 11000:
        return new DatabaseError('중복된 데이터가 존재합니다.');
      default:
        return new DatabaseError('데이터베이스 작업 중 오류가 발생했습니다.');
    }
  }
  
  return error;
};

export const formatErrorResponse = (error) => {
  return {
    status: error.status || 'error',
    message: error.message,
    code: error.statusCode || 500,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  };
};