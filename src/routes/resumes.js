import express from 'express';
import { ResumeController } from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';
import { validateResume } from '../middleware/validators/resumeValidators.js';
import { validateId, validatePagination } from '../middleware/validators/common/index.js';

export const router = express.Router();
const resumeController = new ResumeController();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

// 이력서 CRUD 라우트
router.post('/', validateResume, resumeController.createResume);
router.get('/', validatePagination, resumeController.getResumes);
router.put('/:id', validateId, validateResume, resumeController.updateResume);
router.delete('/:id', validateId, resumeController.deleteResume);