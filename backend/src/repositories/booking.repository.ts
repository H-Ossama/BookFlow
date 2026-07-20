import { prisma } from '../config/database';
import type { BookingStatus } from '@prisma/client';

const bookingIncludes = {
  employee: { include: { user: { select: { id: true, email: true, firstName: true, lastName: true } } } },
  service: { select: { id: true, name: true, duration: true, price: true } },
  company: { select: { id: true, name: true } },
  coupon: { select: { id: true, code: true, discountPercent: true } },
} as const;

interface BookingFilters {
  companyId?: string;
  employeeId?: string;
  customerId?: string;
  status?: BookingStatus;
  dateFrom?: string;
  dateTo?: string;
}

export class BookingRepository {
  static async findOverlapping(employeeId: string, date: string, startTime: string, endTime: string, excludeId?: string) {
    const where: any = {
      employeeId,
      date: new Date(date),
      status: { in: ['PENDING', 'CONFIRMED'] },
      OR: [
        { startTime: { lt: endTime }, endTime: { gt: startTime } },
        { startTime: { gte: startTime, lt: endTime } },
      ],
    };
    if (excludeId) where.id = { not: excludeId };
    return prisma.booking.findMany({ where });
  }

  static async findAll(filters: BookingFilters, page: number = 1, limit: number = 20) {
    const where: any = {};
    if (filters.companyId) where.companyId = filters.companyId;
    if (filters.employeeId) where.employeeId = filters.employeeId;
    if (filters.customerId) where.customerId = filters.customerId;
    if (filters.status) where.status = filters.status;
    if (filters.dateFrom || filters.dateTo) {
      where.date = {};
      if (filters.dateFrom) where.date.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.date.lte = new Date(filters.dateTo);
    }

    const skip = (page - 1) * limit;
    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({ where, include: bookingIncludes, orderBy: [{ date: 'asc' }, { startTime: 'asc' }], skip, take: limit }),
      prisma.booking.count({ where }),
    ]);

    return { bookings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return prisma.booking.findUnique({ where: { id }, include: bookingIncludes });
  }

  static async create(data: {
    customerId: string;
    employeeId: string;
    serviceId: string;
    companyId: string;
    date: Date;
    startTime: string;
    endTime: string;
    notes?: string;
    totalPrice: number;
    discountAmount: number;
    couponId?: string;
  }) {
    return prisma.booking.create({
      data: {
        customerId: data.customerId,
        employeeId: data.employeeId,
        serviceId: data.serviceId,
        companyId: data.companyId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime,
        notes: data.notes,
        totalPrice: data.totalPrice,
        discountAmount: data.discountAmount,
        ...(data.couponId ? { couponId: data.couponId } : {}),
      },
      include: bookingIncludes,
    });
  }

  static async updateStatus(id: string, status: BookingStatus) {
    return prisma.booking.update({ where: { id }, data: { status }, include: bookingIncludes });
  }

  static async update(id: string, data: { date?: Date; startTime?: string; endTime?: string }) {
    return prisma.booking.update({ where: { id }, data, include: bookingIncludes });
  }

  static async delete(id: string) {
    return prisma.booking.delete({ where: { id } });
  }

  static async findByEmployeeAndDate(employeeId: string, date: string) {
    return prisma.booking.findMany({
      where: { employeeId, date: new Date(date), status: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { startTime: 'asc' },
    });
  }
}
