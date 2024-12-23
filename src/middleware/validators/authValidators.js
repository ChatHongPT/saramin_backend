import { body } from 'express-validator';
import { validateRequest } from '../../utils/validateRequest.js';

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

export const validateProfileUpdate = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('이름은 최소 2자 이상이어야 합니다.'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('비밀번호는 최소 8자 이상이어야 합니다.')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('비밀번호는 영문 대/소문자와 숫자를 포함해야 합니다.'),
  body('profile.phone')
    .optional()
    .trim()
    .matches(/^[0-9-+()]*$/)
    .withMessage('올바른 전화번호 형식이 아닙니다.'),
  body('profile.address').optional().trim(),
  body('profile.skills')
    .optional()
    .isArray()
    .withMessage('skills는 배열 형태여야 합니다.'),
  validateRequest,
];
