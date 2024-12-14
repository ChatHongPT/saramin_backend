import { body } from 'express-validator';
import { validateRequest } from './common/validateRequest.js';

export const validateResume = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('이력서 제목을 입력해주세요.')
    .isLength({ max: 100 })
    .withMessage('제목은 100자를 초과할 수 없습니다.'),

  body('content.basicInfo')
    .optional()
    .isObject()
    .withMessage('기본 정보는 객체 형태여야 합니다.'),

  body('content.basicInfo.email')
    .optional()
    .isEmail()
    .withMessage('유효한 이메일주소를 입력해주세요.'),

  body('content.basicInfo.phone')
    .optional()
    .matches(/^[0-9-+()]*$/)
    .withMessage('유효한 전화번호 형식이 아닙니다.'),

  body('content.education')
    .optional()
    .isArray()
    .withMessage('학력 정보는 배열 형태여야 합니다.'),

  body('content.experience')
    .optional()
    .isArray()
    .withMessage('경력 정보는 배열 형태여야 합니다.'),

  body('content.skills')
    .optional()
    .isArray()
    .withMessage('기술 스택은 배열 형태여야 합니다.'),

  validateRequest,
];