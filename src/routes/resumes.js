import express from 'express';
import { ResumeController } from '../controllers/resumeController.js';
import { authenticate } from '../middleware/auth.js';
import { validateResume } from '../middleware/validators/resumeValidators.js';
import { validateId, validatePagination } from '../middleware/validators/common/index.js';
import { asyncWrapper } from '../middleware/asyncWrapper.js';

export const router = express.Router();
const resumeController = new ResumeController();
const controller = asyncWrapper(resumeController);

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

// 이력서 CRUD
router.post('/', validateResume, controller.createResume);
router.get('/', validatePagination, controller.getResumes);
router.get('/:id', validateId, controller.getResumeById);
router.put('/:id', validateId, validateResume, controller.updateResume);
router.delete('/:id', validateId, controller.deleteResume);

// 기본 이력서 설정
router.put('/:id/default', validateId, controller.setDefaultResume);

// 버전 관리
router.post('/:id/versions', validateId, controller.createVersion);