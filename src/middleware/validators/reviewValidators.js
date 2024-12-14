import { body } from 'express-validator';
import { validateRequest } from './common/validateRequest.js';

export const validateReview = [
  body('company')
    .isMongoId()
    .withMessage('올바른 회사 ID가 아닙니다.'),

  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('평점은 1-5 사이의 숫자여야 합니다.'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('리뷰 내용을 입력해주세요.')
    .isLength({ max: 2000 })
    .withMessage('리뷰 내용은 2000자를 초과할 수 없습니다.'),

  body('pros')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('장점은 1000자를 초과할 수 없습니다.'),

  body('cons')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('단점은 1000자를 초과할 수 없습니다.'),

  body('isAnonymous')
    .optional()
    .isBoolean()
    .withMessage('익명 여부는 boolean 값이어야 합니다.'),

  validateRequest,
];