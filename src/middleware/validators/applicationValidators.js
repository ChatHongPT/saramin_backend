import { body } from 'express-validator';
import { validateRequest } from '../../utils/validateRequest.js';

export const validateApplication = [
  body('job')
    .isMongoId()
    .withMessage('올바른 채용공고 ID가 아닙니다.'),
  body('coverLetter')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('자기소개서는 5000자를 초과할 수 없습니다.'),
  body('resume.url')
    .optional()
    .isURL()
    .withMessage('올바른 이력서 URL이 아닙니다.'),
  body('answers')
    .optional()
    .isArray()
    .withMessage('답변은 배열 형태여야 합니다.'),
  body('answers.*.question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('질문을 입력해주세요.'),
  body('answers.*.answer')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('답변을 입력해주세요.'),
  validateRequest
];