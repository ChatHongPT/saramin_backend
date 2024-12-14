import { ApiError } from '../utils/ApiError.js';

export const roles = {
  USER: 'user',
  ADMIN: 'admin',
};

export const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, '인증이 필요합니다.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, '이 작업에 대한 권한이 없습니다.'));
    }

    next();
  };
};
