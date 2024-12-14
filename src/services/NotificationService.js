import { Notification } from '../models/Notification.js';
import { ApiError } from '../utils/ApiError.js';

export class NotificationService {
  async getUserNotifications(userId, options = {}) {
    const { page = 1, limit = 20 } = options;
    
    const [notifications, total] = await Promise.all([
      Notification.find({ user: userId })
        .sort('-createdAt')
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('job'),
      Notification.countDocuments({ user: userId })
    ]);

    return { notifications, total };
  }

  async deleteNotification(id, userId) {
    const notification = await Notification.findOneAndDelete({
      _id: id,
      user: userId
    });

    if (!notification) {
      throw new ApiError(404, '알림을 찾을 수 없습니다.');
    }
  }
}