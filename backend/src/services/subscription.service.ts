import { SubscriptionRepository } from '../repositories/subscription.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type { SubscriptionPlan } from '@prisma/client';

export class SubscriptionService {
  static async getPlans() {
    const plans = await prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
    return plans.map(p => ({
      id: p.name,
      name: p.name,
      price: p.price,
      monthlyBookings: p.monthlyBookings,
      employees: p.employees,
      features: p.features,
    }));
  }

  static async getCurrentPlan(companyId: string) {
    const company = await SubscriptionRepository.getCompanyPlan(companyId);
    if (!company) throw new NotFoundError('Company not found');
    const planRecord = await prisma.plan.findFirst({ where: { name: company.subscriptionPlan } });
    const planConfig = planRecord || { monthlyBookings: 5, employees: 2, features: [] };

    // Count current month's bookings
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const { total: currentMonthBookings } = await BookingRepository.findAll(
      { companyId, dateFrom: monthStart.toISOString().split('T')[0] },
      1, 1,
    );

    // Count employee count
    const employeeCount = await prisma.employee.count({ where: { companyId } });

    return {
      id: company.subscriptionPlan,
      plan: company.subscriptionPlan,
      ...planConfig,
      currentMonthBookings,
      employeeCount,
      usagePercent: Math.round((currentMonthBookings / planConfig.monthlyBookings) * 100),
    };
  }

  static async changePlan(companyId: string, newPlan: SubscriptionPlan) {
    const dbPlan = await prisma.plan.findFirst({ where: { name: newPlan, isActive: true } });
    if (!dbPlan) throw new BadRequestError('Invalid or inactive plan');

    const company = await SubscriptionRepository.getCompanyPlan(companyId);
    if (!company) throw new NotFoundError('Company not found');

    const now = new Date();
    const periodEnd = new Date(now);
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await SubscriptionRepository.createOrUpdate(companyId, {
      plan: newPlan,
      status: 'active',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    });

    // Update company's subscriptionPlan field
    await prisma.company.update({
      where: { id: companyId },
      data: { subscriptionPlan: newPlan },
    });

    return { plan: newPlan, message: `Upgraded to ${newPlan}` };
  }
}
