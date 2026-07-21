import { prisma } from '../config/database';

export class NotificationRepository {
  static async findByUser(userId: string, page: number = 1, limit: number = 50) {
    const skip = (page - 1) * limit;
    return prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    });
  }

  static async countByUser(userId: string) {
    return prisma.notification.count({ where: { userId } });
  }

  static async countUnread(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  }

  static async create(userId: string, data: { type: string; title: string; message: string }) {
    return prisma.notification.create({ data: { ...data, userId } });
  }

  static async createMany(data: { userId: string; type: string; title: string; message: string }[]) {
    return prisma.notification.createMany({ data });
  }

  static async markAsRead(id: string, userId: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  }

  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  }
}
