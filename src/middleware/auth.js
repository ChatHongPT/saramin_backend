import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, '인증이 필요합니다.');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      next(new ApiError(401, '토큰이 만료되었습니다.'));
    } else {
      next(new ApiError(401, '유효하지 않은 토큰입니다.'));
    }
  }
};
