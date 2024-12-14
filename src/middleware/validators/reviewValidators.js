import { body } from 'express-validator';
import { validateRequest } from './common/validateRequest.js';

export const validateReview = [
  body('job')
    .isMongoId()
    .withMessage('올바른 채용공고 ID가 아닙니다.'),

  body('rating.overall')
    .isInt({ min: 1, max: 5 })
    .withMessage('전체 평점은 1-5 사이의 숫자여야 합니다.'),

  body('rating.workLifeBalance')
    .isInt({ min: 1, max: 5 })
    .withMessage('워라밸 평점은 1-5 사이의 숫자여야 합니다.'),

  body('rating.compensation')
    .isInt({ min: 1, max: 5 })
    .withMessage('보상 평점은 1-5 사이의 숫자여야 합니다.'),

  body('rating.culture')
    .isInt({ min: 1, max: 5 })
    .withMessage('문화 평점은 1-5 사이의 숫자여야 합니다.'),

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

  validateRequest
];