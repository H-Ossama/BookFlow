import { prisma } from '../config/database';

export class AnalyticsRepository {
  static async dashboardStats(companyId: string, dateFrom: Date, dateTo: Date) {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [todayBookings, periodBookings, topEmployees, popularServices, cancellationData] = await Promise.all([
      prisma.booking.count({
        where: { companyId, date: { gte: todayStart, lte: todayEnd }, status: { not: 'CANCELLED' } },
      }),
      prisma.booking.findMany({
        where: { companyId, createdAt: { gte: dateFrom, lte: dateTo }, status: { not: 'CANCELLED' } },
        select: { totalPrice: true, discountAmount: true, status: true },
      }),
      prisma.booking.groupBy({
        by: ['employeeId'],
        where: { companyId, createdAt: { gte: dateFrom, lte: dateTo }, status: { not: 'CANCELLED' } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.booking.groupBy({
        by: ['serviceId'],
        where: { companyId, createdAt: { gte: dateFrom, lte: dateTo }, status: { not: 'CANCELLED' } },
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
      }),
      prisma.booking.groupBy({
        by: ['status'],
        where: { companyId, createdAt: { gte: dateFrom, lte: dateTo } },
        _count: { id: true },
      }),
    ]);

    const revenue = periodBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const cancelledCount = cancellationData.find((d) => d.status === 'CANCELLED')?._count.id || 0;
    const totalCount = cancellationData.reduce((sum, d) => sum + d._count.id, 0);
    const cancellationRate = totalCount > 0 ? (cancelledCount / totalCount) * 100 : 0;

    // Resolve employee names
    const employeeIds = topEmployees.map((e) => e.employeeId);
    const employees = employeeIds.length > 0
      ? await prisma.employee.findMany({
          where: { id: { in: employeeIds } },
          include: { user: { select: { firstName: true, lastName: true } } },
        })
      : [];
    const employeeMap = new Map(employees.map((e) => [e.id, e]));

    // Resolve service names
    const serviceIds = popularServices.map((s) => s.serviceId);
    const services = serviceIds.length > 0
      ? await prisma.service.findMany({ where: { id: { in: serviceIds } }, select: { id: true, name: true, price: true } })
      : [];
    const serviceMap = new Map(services.map((s) => [s.id, s]));

    return {
      todayBookings,
      periodRevenue: revenue,
      periodBookingsCount: periodBookings.length,
      cancellationRate: Math.round(cancellationRate * 100) / 100,
      topEmployees: topEmployees.map((e) => ({
        id: e.employeeId,
        name: `${employeeMap.get(e.employeeId)?.user.firstName || '?'} ${employeeMap.get(e.employeeId)?.user.lastName || '?'}`,
        bookingCount: e._count.id,
      })),
      popularServices: popularServices.map((s) => ({
        id: s.serviceId,
        name: serviceMap.get(s.serviceId)?.name || '?',
        price: serviceMap.get(s.serviceId)?.price || 0,
        bookingCount: s._count.id,
      })),
    };
  }

  static async recentBookings(companyId: string, limit: number = 10) {
    return prisma.booking.findMany({
      where: { companyId },
      include: {
        employee: { include: { user: { select: { firstName: true, lastName: true } } } },
        service: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
}
