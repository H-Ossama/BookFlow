import { prisma } from '../config/database';

export class ReportRepository {
  static async getBookings(companyId: string, dateFrom: Date, dateTo: Date) {
    return prisma.booking.findMany({
      where: { companyId, date: { gte: dateFrom, lte: dateTo } },
      include: {
        employee: { include: { user: { select: { firstName: true, lastName: true, email: true } } } },
        service: { select: { id: true, name: true, duration: true, price: true } },
        coupon: { select: { code: true, discountPercent: true } },
      },
      orderBy: { date: 'asc' },
    });
  }

  static async getRevenue(companyId: string, dateFrom: Date, dateTo: Date) {
    return prisma.booking.findMany({
      where: { companyId, date: { gte: dateFrom, lte: dateTo }, status: { not: 'CANCELLED' } },
      select: { date: true, totalPrice: true, discountAmount: true, status: true, service: { select: { name: true } } },
      orderBy: { date: 'asc' },
    });
  }

  static async getCustomers(companyId: string, dateFrom: Date, dateTo: Date) {
    const bookings = await prisma.booking.findMany({
      where: { companyId, createdAt: { gte: dateFrom, lte: dateTo } },
      select: { customerId: true, totalPrice: true, status: true, createdAt: true },
    });
    const customerIds = [...new Set(bookings.map((b) => b.customerId))];
    const users = customerIds.length > 0
      ? await prisma.user.findMany({ where: { id: { in: customerIds } }, select: { id: true, firstName: true, lastName: true, email: true, createdAt: true } })
      : [];
    return { users, bookings };
  }
}
