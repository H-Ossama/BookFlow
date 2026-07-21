import { prisma } from '../config/database';
import type { SubscriptionPlan } from '@prisma/client';

interface GetCompaniesParams {
  page?: number;
  limit?: number;
  search?: string;
  plan?: string;
  isActive?: string;
}

export class AdminService {
  static async getDashboard() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const [
      totalCompanies,
      activeCompanies,
      totalUsers,
      totalBookings,
      periodBookings,
      periodRevenue,
      totalRevenue,
      todayBookings,
      pendingCompanies,
      subscriptionDistribution,
      recentCompanies,
      monthlyTrend,
    ] = await Promise.all([
      prisma.company.count(),
      prisma.company.count({ where: { isActive: true } }),
      prisma.user.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { createdAt: { gte: monthStart } } }),
      prisma.booking.aggregate({ _sum: { totalPrice: true }, where: { createdAt: { gte: monthStart } } }),
      prisma.booking.aggregate({ _sum: { totalPrice: true } }),
      prisma.booking.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.company.count({ where: { isActive: false } }),
      prisma.company.groupBy({ by: ['subscriptionPlan'], _count: true }),
      prisma.company.findMany({ orderBy: { createdAt: 'desc' }, take: 5, include: { _count: { select: { users: true, services: true, bookings: true } } } }),
      prisma.$queryRaw`
        SELECT
          DATE_TRUNC('month', "createdAt") as month,
          COUNT(*)::int as bookings,
          COALESCE(SUM("totalPrice"), 0)::float as revenue
        FROM "Booking"
        WHERE "createdAt" >= NOW() - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month ASC
      `,
    ]);

    const planDist = { FREE: 0, BASIC: 0, PREMIUM: 0 };
    for (const row of subscriptionDistribution) {
      planDist[row.subscriptionPlan as keyof typeof planDist] = row._count;
    }

    return {
      totalCompanies,
      activeCompanies,
      pendingCompanies,
      totalUsers,
      totalBookings,
      periodBookings,
      periodRevenue: periodRevenue._sum.totalPrice || 0,
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      todayBookings,
      subscriptionDistribution: planDist,
      recentCompanies: recentCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        subscriptionPlan: c.subscriptionPlan,
        isActive: c.isActive,
        createdAt: c.createdAt,
        _count: c._count,
      })),
      monthlyTrend: Array.isArray(monthlyTrend) ? monthlyTrend.map((row: any) => ({
        month: row.month ? new Date(row.month).toLocaleString('default', { month: 'short', year: '2-digit' }) : '',
        bookings: Number(row.bookings),
        revenue: Number(row.revenue),
      })) : [],
    };
  }

  static async getCompanies(params: GetCompaniesParams) {
    const page = params.page || 1;
    const limit = Math.min(params.limit || 20, 100);
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.search) {
      where.OR = [
        { name: { contains: params.search, mode: 'insensitive' } },
        { email: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
      ];
    }
    if (params.plan) where.subscriptionPlan = params.plan;
    if (params.isActive !== undefined) where.isActive = params.isActive === 'true';

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: { select: { users: true, services: true, employees: true, bookings: true, reviews: true } },
        },
      }),
      prisma.company.count({ where }),
    ]);

    return { companies, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async getPlatformStats() {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      totalUsers,
      roleDistribution,
      bookingStatusDist,
      totalReviews,
      avgRating,
      totalCoupons,
      activeCoupons,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ['role'], _count: true }),
      prisma.booking.groupBy({ by: ['status'], _count: true }),
      prisma.review.count(),
      prisma.review.aggregate({ _avg: { rating: true } }),
      prisma.coupon.count(),
      prisma.coupon.count({ where: { isActive: true } }),
    ]);

    const roleDist = { SUPER_ADMIN: 0, COMPANY_ADMIN: 0, EMPLOYEE: 0, CUSTOMER: 0 };
    for (const row of roleDistribution) {
      roleDist[row.role as keyof typeof roleDist] = row._count;
    }

    const statusDist = { PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, REJECTED: 0 };
    for (const row of bookingStatusDist) {
      statusDist[row.status as keyof typeof statusDist] = row._count;
    }

    const topCompanies = await prisma.company.findMany({
      orderBy: { bookings: { _count: 'desc' } },
      take: 10,
      include: { _count: { select: { bookings: true, reviews: true } } },
    });

    return {
      totalUsers,
      roleDistribution: roleDist,
      bookingStatusDistribution: statusDist,
      totalReviews,
      averageRating: avgRating._avg.rating || 0,
      totalCoupons,
      activeCoupons,
      topCompanies: topCompanies.map((c) => ({
        id: c.id,
        name: c.name,
        subscriptionPlan: c.subscriptionPlan,
        isActive: c.isActive,
        bookingCount: c._count.bookings,
        reviewCount: c._count.reviews,
      })),
    };
  }

  static async getCompanyDetail(id: string) {
    const company = await prisma.company.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true, services: true, employees: true, bookings: true, reviews: true, coupons: true } },
        users: { select: { id: true, firstName: true, lastName: true, email: true, role: true, createdAt: true } },
      },
    });
    if (!company) return null;

    const recentBookings = await prisma.booking.findMany({
      where: { companyId: id },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { service: { select: { name: true } }, employee: { include: { user: { select: { firstName: true, lastName: true } } } } },
    });

    return { ...company, recentBookings };
  }

  static async updateCompany(id: string, data: { name?: string; description?: string; phone?: string; email?: string; address?: string; isActive?: boolean; subscriptionPlan?: SubscriptionPlan }) {
    const company = await prisma.company.update({ where: { id }, data });
    return company;
  }

  static async deleteCompany(id: string) {
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { companyId: id } }),
      prisma.review.deleteMany({ where: { companyId: id } }),
      prisma.coupon.deleteMany({ where: { companyId: id } }),
      prisma.holiday.deleteMany({ where: { companyId: id } }),
      prisma.workingHours.deleteMany({ where: { employee: { companyId: id } } }),
      prisma.vacationDay.deleteMany({ where: { employee: { companyId: id } } }),
      prisma.employee.deleteMany({ where: { companyId: id } }),
      prisma.service.deleteMany({ where: { companyId: id } }),
      prisma.subscription.deleteMany({ where: { companyId: id } }),
      prisma.user.updateMany({ where: { companyId: id }, data: { companyId: null } }),
      prisma.company.delete({ where: { id } }),
    ]);
    return { message: 'Company deleted successfully' };
  }

  static async getPlans() {
    return prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  static async createPlan(data: { name: string; description?: string; price: number; monthlyBookings: number; employees: number; features: string[]; sortOrder?: number }) {
    return prisma.plan.create({ data });
  }

  static async updatePlan(id: string, data: { name?: string; description?: string; price?: number; monthlyBookings?: number; employees?: number; features?: string[]; isActive?: boolean; sortOrder?: number }) {
    return prisma.plan.update({ where: { id }, data });
  }

  static async deletePlan(id: string) {
    return prisma.plan.delete({ where: { id } });
  }

  static async getCoupons() {
    return prisma.coupon.findMany({ where: { companyId: null }, orderBy: { createdAt: 'desc' } });
  }

  static async createCoupon(data: { code: string; description?: string; discountPercent: number; maxUses?: number; expiresAt?: string; applicablePlans?: string[] }) {
    const existing = await prisma.coupon.findFirst({ where: { code: data.code, companyId: null } });
    if (existing) throw new Error('Coupon code already exists');
    return prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountPercent: data.discountPercent,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        applicablePlans: data.applicablePlans || [],
      },
    });
  }

  static async updateCoupon(id: string, data: { code?: string; description?: string; discountPercent?: number; maxUses?: number; expiresAt?: string; isActive?: boolean; applicablePlans?: string[] }) {
    const updateData: any = { ...data };
    if (data.expiresAt !== undefined) updateData.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    return prisma.coupon.update({ where: { id }, data: updateData });
  }

  static async deleteCoupon(id: string) {
    return prisma.coupon.delete({ where: { id } });
  }

  static async getFeatures() {
    return prisma.platformFeature.findMany({ orderBy: { category: 'asc' } });
  }

  static async createFeature(data: { name: string; description?: string; key: string; category?: string }) {
    return prisma.platformFeature.create({ data });
  }

  static async updateFeature(id: string, data: { name?: string; description?: string; key?: string; category?: string }) {
    return prisma.platformFeature.update({ where: { id }, data });
  }

  static async deleteFeature(id: string) {
    return prisma.platformFeature.delete({ where: { id } });
  }

  static async getCompanyRevenue(companyId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const yearStart = new Date(now.getFullYear(), 0, 1);

    const [completedBookings, revenueByService, periodStats, yearStats, recentTransactions] = await Promise.all([
      prisma.booking.findMany({
        where: { companyId, status: 'COMPLETED' },
        include: { service: { select: { id: true, name: true, price: true, duration: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.$queryRaw`
        SELECT
          s.id as "serviceId",
          s.name as "serviceName",
          COUNT(b.id)::int as "bookingCount",
          COALESCE(SUM(b."totalPrice"), 0)::float as "totalRevenue",
          COALESCE(SUM(b."discountAmount"), 0)::float as "totalDiscount",
          COALESCE(AVG(b."totalPrice"), 0)::float as "avgPrice"
        FROM "Service" s
        LEFT JOIN "Booking" b ON b."serviceId" = s.id AND b."companyId" = s."companyId" AND b.status = 'COMPLETED'
        WHERE s."companyId" = ${companyId}
        GROUP BY s.id, s.name
        ORDER BY "totalRevenue" DESC
      `,
      prisma.booking.aggregate({
        _sum: { totalPrice: true, discountAmount: true },
        _count: true,
        where: { companyId, status: 'COMPLETED', createdAt: { gte: monthStart } },
      }),
      prisma.booking.aggregate({
        _sum: { totalPrice: true, discountAmount: true },
        _count: true,
        where: { companyId, status: 'COMPLETED', createdAt: { gte: yearStart } },
      }),
      prisma.booking.findMany({
        where: { companyId, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: {
          service: { select: { name: true } },
          employee: { include: { user: { select: { firstName: true, lastName: true } } } },
        },
      }),
    ]);

    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.totalPrice, 0);
    const totalDiscount = completedBookings.reduce((sum, b) => sum + b.discountAmount, 0);

    return {
      summary: {
        totalBookings: completedBookings.length,
        totalRevenue,
        totalDiscount,
        netRevenue: totalRevenue - totalDiscount,
        averageBookingValue: completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0,
      },
      periodRevenue: {
        bookings: periodStats._count,
        revenue: periodStats._sum.totalPrice || 0,
        discount: periodStats._sum.discountAmount || 0,
      },
      yearRevenue: {
        bookings: yearStats._count,
        revenue: yearStats._sum.totalPrice || 0,
        discount: yearStats._sum.discountAmount || 0,
      },
      revenueByService: Array.isArray(revenueByService) ? revenueByService.map((row: any) => ({
        serviceId: row.serviceId,
        serviceName: row.serviceName,
        bookingCount: Number(row.bookingCount),
        totalRevenue: Number(row.totalRevenue),
        totalDiscount: Number(row.totalDiscount),
        avgPrice: Number(row.avgPrice),
      })) : [],
      recentTransactions: recentTransactions.map((b) => ({
        id: b.id,
        date: b.createdAt,
        service: b.service.name,
        employee: `${b.employee.user.firstName} ${b.employee.user.lastName}`,
        amount: b.totalPrice,
        discount: b.discountAmount,
      })),
    };
  }
}
