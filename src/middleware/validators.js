import { body, query, param } from 'express-validator';
import { validateRequest } from '../utils/validateRequest.js';

// Auth validators
export const validateRegistration = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대/소문자와 숫자를 포함해야 합니다.'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('이름은 최소 2자 이상이어야 합니다.'),
  validateRequest,
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('유효한 이메일 주소를 입력해주세요.')
    .normalizeEmail(),
  body('password').notEmpty().withMessage('비밀번호를 입력해주세요.'),
  validateRequest,
];

// Job validators
export const validateJobSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('한 페이지당 항목 수는 1-100 사이여야 합니다.'),
  query('location').optional().isString().trim(),
  query('experience').optional().isString().trim(),
  query('skills').optional().isString().trim(),
  query('type')
    .optional()
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .withMessage('올바른 고용 형태를 선택해주세요.'),
  validateRequest,
];
