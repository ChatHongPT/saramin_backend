import { query } from 'express-validator';
import { validateRequest } from '../validators/common/validateRequest.js';

export const validateJobFilters = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('페이지 번호는 1 이상의 정수여야 합니다.'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('한 페이지당 항목 수는 1-100 사이여야 합니다.'),
  
  query('location')
    .optional()
    .isString()
    .trim()
    .withMessage('올바른 지역을 입력해주세요.'),
  
  query('experience')
    .optional()
    .matches(/^\d+(-\d+)?$/)
    .withMessage('경력은 숫자 또는 숫자-숫자 형식이어야 합니다.'),
  
  query('salary')
    .optional()
    .matches(/^\d+(-\d+)?$/)
    .withMessage('급여는 숫자 또는 숫자-숫자 형식이어야 합니다.'),
  
  query('skills')
    .optional()
    .isString()
    .withMessage('기술스택은 쉼표로 구분된 문자열이어야 합니다.'),
  
  query('sort')
    .optional()
    .isIn(['latest', 'salary', 'views'])
    .withMessage('유효한 정렬 기준이 아닙니다.'),
  
  validateRequest
];