import { NotificationRepository } from '../repositories/notification.repository';

export class NotificationService {
  static async list(userId: string) {
    const [notifications, unreadCount] = await Promise.all([
      NotificationRepository.findByUser(userId),
      NotificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount };
  }

  static async markRead(notificationId: string, userId: string) {
    return NotificationRepository.markAsRead(notificationId, userId);
  }

  static async markAllRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }

  static async createNotification(userId: string, type: string, title: string, message: string) {
    return NotificationRepository.create(userId, { type, title, message });
  }
}
