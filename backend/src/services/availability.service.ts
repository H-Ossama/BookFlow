import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

export class AvailabilityService {
  static async getAvailableSlots(companyId: string, employeeId: string, date: string) {
    const employee = await prisma.employee.findUnique({ where: { id: employeeId } });
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    if (!employee.isActive) throw new BadRequestError('Employee is not available');

    const bookingDate = new Date(date);
    const dayOfWeek = bookingDate.getDay();

    // Check vacation
    const vacation = await prisma.vacationDay.findFirst({ where: { employeeId, date: bookingDate } });
    if (vacation) return [];

    // Check holiday
    const holiday = await prisma.holiday.findFirst({ where: { companyId, date: bookingDate } });
    if (holiday) return [];

    // Get working hours
    const workingHours = await prisma.workingHours.findFirst({
      where: { employeeId, dayOfWeek, isActive: true },
    });
    if (!workingHours) return [];

    // Get existing bookings for the day
    const bookings = await prisma.booking.findMany({
      where: { employeeId, date: bookingDate, status: { in: ['PENDING', 'CONFIRMED'] } },
      orderBy: { startTime: 'asc' },
    });

    // Get all services for this employee's company (to know available durations)
    const services = await prisma.service.findMany({
      where: { companyId, isActive: true },
      select: { id: true, name: true, duration: true, price: true },
    });

    // Generate slots in 15-minute increments
    const slotSize = 15;
    const startMinutes = timeToMinutes(workingHours.startTime);
    const endMinutes = timeToMinutes(workingHours.endTime);
    const slots: { time: string; available: boolean; availableServices: { id: string; name: string; duration: number; price: number }[] }[] = [];

    for (let m = startMinutes; m + slotSize <= endMinutes; m += slotSize) {
      const time = minutesToTime(m);

      // Check if this slot overlaps any existing booking
      const isBooked = bookings.some((b) => {
        const bStart = timeToMinutes(b.startTime);
        const bEnd = timeToMinutes(b.endTime);
        return m < bEnd && m + slotSize > bStart;
      });

      // Check which services can fit in the remaining time before the next booking or end of day
      const nextBookingStart = bookings
        .map((b) => timeToMinutes(b.startTime))
        .filter((s) => s > m)
        .sort((a, b) => a - b);
      const slotEnd = nextBookingStart.length > 0 ? nextBookingStart[0] : endMinutes;
      const availableMinutes = slotEnd - m;

      const availableServices = services.filter((s) => s.duration <= availableMinutes);

      slots.push({ time, available: !isBooked && availableServices.length > 0, availableServices });
    }

    return slots;
  }
}
