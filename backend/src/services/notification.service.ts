import { NotificationRepository } from '../repositories/notification.repository';
import { prisma } from '../config/database';

export const NotificationTypes = {
  BOOKING_CREATED: 'booking_created',
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_CANCELLED: 'booking_cancelled',
  BOOKING_REJECTED: 'booking_rejected',
  BOOKING_COMPLETED: 'booking_completed',
  BOOKING_RESCHEDULED: 'booking_rescheduled',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CHANGED: 'subscription_changed',
  NEW_REVIEW: 'new_review',
  EMPLOYEE_BOOKING: 'employee_booking',
} as const;

export class NotificationService {
  static async list(userId: string, page = 1, limit = 50) {
    const [notifications, total, unreadCount] = await Promise.all([
      NotificationRepository.findByUser(userId, page, limit),
      NotificationRepository.countByUser(userId),
      NotificationRepository.countUnread(userId),
    ]);
    return { notifications, unreadCount, total, page, totalPages: Math.ceil(total / limit) };
  }

  static async getUnreadCount(userId: string) {
    const count = await NotificationRepository.countUnread(userId);
    return { unreadCount: count };
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

  static async createBulk(userIds: string[], type: string, title: string, message: string) {
    if (userIds.length === 0) return;
    const data = userIds.map((userId) => ({ userId, type, title, message }));
    return NotificationRepository.createMany(data);
  }

  static async notifyCompanyAdmins(companyId: string, type: string, title: string, message: string) {
    const admins = await prisma.user.findMany({
      where: { companyId, role: 'COMPANY_ADMIN' },
      select: { id: true },
    });
    if (admins.length > 0) {
      await this.createBulk(admins.map((a) => a.id), type, title, message);
    }
  }

  static async notifyCompanyStaffWithPermission(companyId: string, permission: string, type: string, title: string, message: string) {
    const staff = await prisma.user.findMany({
      where: {
        companyId,
        role: 'EMPLOYEE',
      },
      select: { id: true, companyRole: { select: { permissions: true } } },
    });
    const filtered = staff.filter((s) => {
      const perms = s.companyRole?.permissions as string[] | undefined;
      return perms?.includes(permission);
    });
    if (filtered.length > 0) {
      await this.createBulk(filtered.map((s) => s.id), type, title, message);
    }
  }

  static async notifySuperAdmins(type: string, title: string, message: string) {
    const superAdmins = await prisma.user.findMany({
      where: { role: 'SUPER_ADMIN' },
      select: { id: true },
    });
    if (superAdmins.length > 0) {
      await this.createBulk(superAdmins.map((a) => a.id), type, title, message);
    }
  }
}
