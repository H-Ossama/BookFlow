import { prisma } from '../config/database';

export class NotificationRepository {
  static async findByUser(userId: string, limit: number = 50) {
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  static async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  static async create(userId: string, data: { type: string; title: string; message: string }) {
    return prisma.notification.create({ data: { ...data, userId } });
  }

  static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }
}
