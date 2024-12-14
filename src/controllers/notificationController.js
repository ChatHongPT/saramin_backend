import { NotificationService } from '../services/NotificationService.js';
import { successResponse } from '../utils/responseUtils.js';

export class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  getNotifications = async (req, res) => {
    const userId = req.user.id;
    const { page = 1, limit = 20 } = req.query;

    const { notifications, total } = await this.notificationService.getUserNotifications(
      userId,
      {
        page: parseInt(page),
        limit: parseInt(limit)
      }
    );

    return successResponse(res, {
      data: notifications,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit)
      }
    });
  };

  deleteNotification = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    await this.notificationService.deleteNotification(id, userId);
    return successResponse(res, {
      message: '알림이 삭제되었습니다.'
    });
  };
}