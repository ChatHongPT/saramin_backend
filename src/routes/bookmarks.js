import express from 'express';
import { BookmarkController } from '../controllers/bookmarkController.js';
import { authenticate } from '../middleware/auth.js';
import { validatePagination } from '../middleware/validators/common/index.js';

export const router = express.Router();
const bookmarkController = new BookmarkController();

// 모든 라우트에 인증 미들웨어 적용
router.use(authenticate);

router.post('/', bookmarkController.createBookmark);
router.get('/', validatePagination, bookmarkController.getBookmarks);
router.delete('/:jobId', bookmarkController.removeBookmark);

export default router;