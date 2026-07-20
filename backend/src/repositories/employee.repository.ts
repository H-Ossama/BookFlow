import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export class EmployeeRepository {
  static async findAll(companyId: string) {
    return prisma.employee.findMany({
      where: { companyId },
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } } },
      orderBy: { user: { firstName: 'asc' } },
    });
  }

  static async findById(id: string) {
    return prisma.employee.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true, avatar: true } },
        workingHours: true,
        vacationDays: true,
      },
    });
  }

  static async create(data: Prisma.EmployeeCreateInput) {
    return prisma.employee.create({ data, include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } } } });
  }

  static async update(id: string, data: Prisma.EmployeeUpdateInput) {
    return prisma.employee.update({ where: { id }, data, include: { user: { select: { id: true, email: true, firstName: true, lastName: true, phone: true } } } });
  }

  static async delete(id: string) {
    return prisma.employee.delete({ where: { id } });
  }

  static async findByUserId(userId: string) {
    return prisma.employee.findUnique({ where: { userId } });
  }
}

export class WorkingHoursRepository {
  static async findByEmployee(employeeId: string) {
    return prisma.workingHours.findMany({ where: { employeeId }, orderBy: { dayOfWeek: 'asc' } });
  }

  static async setForEmployee(employeeId: string, schedules: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }[]) {
    await prisma.workingHours.deleteMany({ where: { employeeId } });
    if (schedules.length > 0) {
      return prisma.workingHours.createMany({ data: schedules.map((s) => ({ ...s, employeeId })) });
    }
  }
}

export class VacationDayRepository {
  static async findByEmployee(employeeId: string) {
    return prisma.vacationDay.findMany({ where: { employeeId }, orderBy: { date: 'asc' } });
  }

  static async create(employeeId: string, data: { date: string; reason?: string }) {
    return prisma.vacationDay.create({ data: { ...data, employeeId } });
  }

  static async delete(id: string) {
    return prisma.vacationDay.delete({ where: { id } });
  }
}
