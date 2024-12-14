import { body, query, param } from 'express-validator';
import { validateRequest } from '../../utils/validateRequest.js';

export const validateJobSearch = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('한 페이지당 항목 수는 1-100 사이여야 합니다.'),
  query('sort')
    .optional()
    .isString()
    .matches(/^(-)?[a-zA-Z]+$/)
    .withMessage('정렬 기준이 올바르지 않습니다.'),
  validateRequest,
];

export const validateJobCreate = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('채용 공고 제목을 입력해주세요.')
    .isLength({ max: 200 })
    .withMessage('제목은 200자를 초과할 수 없습니다.'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('채용 공고 내용을 입력해주세요.'),
  body('location').trim().notEmpty().withMessage('근무 지역을 입력해주세요.'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'temporary'])
    .withMessage('올바른 고용 형태를 선택해주세요.'),
  validateRequest,
];

export const validateJobUpdate = [
  param('id').isMongoId().withMessage('올바른 채용 공고 ID가 아닙니다.'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('채용 공고 제목을 입력해주세요.')
    .isLength({ max: 200 })
    .withMessage('제목은 200자를 초과할 수 없습니다.'),
  validateRequest,
];
