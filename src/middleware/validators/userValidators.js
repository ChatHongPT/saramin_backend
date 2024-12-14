import { body, param } from 'express-validator';
import { validateRequest } from '../../utils/validateRequest.js';

export const validateUserCreate = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('name').trim().notEmpty().withMessage('이름을 입력해주세요.'),
  validateRequest,
];

export const validateUserUpdate = [
  param('id').isMongoId().withMessage('올바른 사용자 ID가 아닙니다.'),
  body('name').optional().trim().notEmpty().withMessage('이름을 입력해주세요.'),
  validateRequest,
];
