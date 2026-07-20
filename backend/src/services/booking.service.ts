import { BookingRepository } from '../repositories/booking.repository';
import { EmployeeRepository } from '../repositories/employee.repository';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../utils/errors';
import type { BookingStatus } from '@prisma/client';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export class BookingService {
  static async list(filters: {
    companyId?: string;
    employeeId?: string;
    customerId?: string;
    status?: BookingStatus;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) {
    return BookingRepository.findAll(
      {
        companyId: filters.companyId,
        employeeId: filters.employeeId,
        customerId: filters.customerId,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo,
      },
      filters.page || 1,
      filters.limit || 20,
    );
  }

  static async getById(bookingId: string, requesterId: string, requesterRole: string) {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (requesterRole === 'CUSTOMER' && booking.customerId !== requesterId) {
      throw new ForbiddenError('You can only view your own bookings');
    }
    return booking;
  }

  static async create(data: {
    customerId: string;
    employeeId: string;
    serviceId: string;
    companyId: string;
    date: string;
    startTime: string;
    notes?: string;
    couponCode?: string;
  }) {
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || service.companyId !== data.companyId) throw new NotFoundError('Service not found');
    if (!service.isActive) throw new BadRequestError('Service is not available');

    const employee = await EmployeeRepository.findById(data.employeeId);
    if (!employee || employee.companyId !== data.companyId) throw new NotFoundError('Employee not found');
    if (!employee.isActive) throw new BadRequestError('Employee is not available');

    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = startMinutes + service.duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const bookingDate = new Date(data.date);
    const dayOfWeek = bookingDate.getDay();
    const workingHours = await prisma.workingHours.findFirst({
      where: { employeeId: data.employeeId, dayOfWeek, isActive: true },
    });
    if (!workingHours) throw new BadRequestError('Employee does not work on this day');
    if (timeToMinutes(data.startTime) < timeToMinutes(workingHours.startTime) || endMinutes > timeToMinutes(workingHours.endTime)) {
      throw new BadRequestError('Booking time is outside working hours');
    }

    const vacation = await prisma.vacationDay.findFirst({
      where: { employeeId: data.employeeId, date: bookingDate },
    });
    if (vacation) throw new BadRequestError('Employee is on vacation on this date');

    const holiday = await prisma.holiday.findFirst({
      where: { companyId: data.companyId, date: bookingDate },
    });
    if (holiday) throw new BadRequestError(`Company is closed on ${holiday.name}`);

    const overlapping = await BookingRepository.findOverlapping(data.employeeId, data.date, data.startTime, endTime);
    if (overlapping.length > 0) throw new ConflictError('This time slot is already booked');

    let discountAmount = 0;
    let couponId: string | undefined;
    if (data.couponCode) {
      const coupon = await prisma.coupon.findFirst({
        where: { code: data.couponCode, companyId: data.companyId, isActive: true },
      });
      if (!coupon) throw new NotFoundError('Invalid coupon code');
      if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) throw new BadRequestError('Coupon has expired');
      if (coupon.maxUses && coupon.currentUses >= coupon.maxUses) throw new BadRequestError('Coupon usage limit reached');
      discountAmount = service.price * (coupon.discountPercent / 100);
      couponId = coupon.id;
      await prisma.coupon.update({ where: { id: coupon.id }, data: { currentUses: { increment: 1 } } });
    }

    const totalPrice = service.price - discountAmount;

    const booking = await BookingRepository.create({
      customerId: data.customerId,
      employeeId: data.employeeId,
      serviceId: data.serviceId,
      companyId: data.companyId,
      date: bookingDate,
      startTime: data.startTime,
      endTime,
      notes: data.notes,
      totalPrice,
      discountAmount,
      couponId,
    });

    NotificationService.createNotification(data.customerId, 'booking_created', 'Booking Created', `Your ${service.name} booking on ${data.date} at ${data.startTime} is pending confirmation.`).catch(() => {});
    NotificationService.createNotification(employee.userId, 'booking_created', 'New Booking', `New ${service.name} booking on ${data.date} at ${data.startTime}.`).catch(() => {});

    const customer = await prisma.user.findUnique({ where: { id: data.customerId } });
    if (customer?.email) {
      EmailService.sendBookingCreated(customer.email, {
        customerName: `${customer.firstName} ${customer.lastName}`,
        serviceName: service.name,
        employeeName: `${employee.user.firstName} ${employee.user.lastName}`,
        date: data.date,
        time: data.startTime,
        price: totalPrice,
        companyName: booking.company.name,
      }).catch(() => {});
    }

    return booking;
  }

  static async updateStatus(bookingId: string, status: BookingStatus, requesterRole: string) {
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');

    if (requesterRole === 'CUSTOMER' && status !== 'CANCELLED') {
      throw new ForbiddenError('Customers can only cancel bookings');
    }

    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      throw new BadRequestError(`Cannot change a ${booking.status.toLowerCase()} booking`);
    }

    if (status === 'CONFIRMED') {
      const overlapping = await BookingRepository.findOverlapping(
        booking.employeeId,
        booking.date.toISOString().split('T')[0],
        booking.startTime,
        booking.endTime,
        booking.id,
      );
      if (overlapping.length > 0) throw new ConflictError('Time slot is no longer available');
    }

    const updated = await BookingRepository.updateStatus(bookingId, status);

    if (status === 'CONFIRMED' || status === 'CANCELLED') {
      const customerUser = await prisma.user.findUnique({ where: { id: booking.customerId } });
      const dateStr = booking.date.toISOString().split('T')[0];
      if (customerUser?.email) {
        if (status === 'CONFIRMED') {
          EmailService.sendBookingConfirmed(customerUser.email, {
            customerName: `${customerUser.firstName} ${customerUser.lastName}`,
            serviceName: booking.service.name,
            employeeName: `${booking.employee.user.firstName} ${booking.employee.user.lastName}`,
            date: dateStr,
            time: booking.startTime,
            price: booking.totalPrice,
            companyName: booking.company.name,
          }).catch(() => {});
        } else if (status === 'CANCELLED') {
          EmailService.sendBookingCancelled(customerUser.email, {
            customerName: `${customerUser.firstName} ${customerUser.lastName}`,
            serviceName: booking.service.name,
            employeeName: `${booking.employee.user.firstName} ${booking.employee.user.lastName}`,
            date: dateStr,
            time: booking.startTime,
            price: booking.totalPrice,
            companyName: booking.company.name,
          }).catch(() => {});
        }
      }
      NotificationService.createNotification(booking.customerId, status === 'CONFIRMED' ? 'booking_confirmed' : 'booking_cancelled',
        status === 'CONFIRMED' ? 'Booking Confirmed' : 'Booking Cancelled',
        `Your ${booking.service.name} booking on ${dateStr} at ${booking.startTime} has been ${status.toLowerCase()}.`).catch(() => {});
    }

    return updated;
  }

  static async reschedule(bookingId: string, requesterRole: string, data: { date: string; startTime: string }) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only admins can reschedule bookings');
    }
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.status === 'COMPLETED' || booking.status === 'CANCELLED' || booking.status === 'REJECTED') {
      throw new BadRequestError('Cannot reschedule a completed or cancelled booking');
    }

    const startMinutes = timeToMinutes(data.startTime);
    const endMinutes = startMinutes + booking.service.duration;
    const endTime = `${String(Math.floor(endMinutes / 60)).padStart(2, '0')}:${String(endMinutes % 60).padStart(2, '0')}`;

    const bookingDate = new Date(data.date);
    const dayOfWeek = bookingDate.getDay();
    const workingHours = await prisma.workingHours.findFirst({
      where: { employeeId: booking.employeeId, dayOfWeek, isActive: true },
    });
    if (!workingHours) throw new BadRequestError('Employee does not work on this day');
    if (timeToMinutes(data.startTime) < timeToMinutes(workingHours.startTime) || endMinutes > timeToMinutes(workingHours.endTime)) {
      throw new BadRequestError('New time is outside working hours');
    }

    const vacation = await prisma.vacationDay.findFirst({
      where: { employeeId: booking.employeeId, date: bookingDate },
    });
    if (vacation) throw new BadRequestError('Employee is on vacation on this date');

    const overlapping = await BookingRepository.findOverlapping(booking.employeeId, data.date, data.startTime, endTime, bookingId);
    if (overlapping.length > 0) throw new ConflictError('This time slot is no longer available');

    return BookingRepository.update(bookingId, {
      date: bookingDate,
      startTime: data.startTime,
      endTime,
    });
  }

  static async delete(bookingId: string, requesterRole: string) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only admins can delete bookings');
    }
    const booking = await BookingRepository.findById(bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    return BookingRepository.delete(bookingId);
  }
}
