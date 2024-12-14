import express from 'express';
import { NotificationController } from '../controllers/notificationController.js';
import { authenticate } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validators/common/index.js';

export const router = express.Router();
const notificationController = new NotificationController();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

router.get('/', validatePagination, notificationController.getNotifications);
router.delete('/:id', notificationController.deleteNotification);

export default router;