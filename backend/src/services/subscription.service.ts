import { SubscriptionRepository } from '../repositories/subscription.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { prisma } from '../config/database';
import { NotFoundError, BadRequestError } from '../utils/errors';
import type { SubscriptionPlan } from '@prisma/client';

const PLAN_LIMITS: Record<SubscriptionPlan, { monthlyBookings: number; employees: number; features: string[] }> = {
  FREE: { monthlyBookings: 5, employees: 2, features: ['Basic booking management', 'Email notifications'] },
  BASIC: { monthlyBookings: 50, employees: 10, features: ['All Free features', 'Analytics dashboard', 'Coupon codes', 'CSV exports'] },
  PREMIUM: { monthlyBookings: 9999, employees: 9999, features: ['All Basic features', 'Stripe payments', 'Advanced analytics', 'Priority support', 'API access'] },
};

export const PLANS = Object.entries(PLAN_LIMITS).map(([id, config]) => ({
  id: id as SubscriptionPlan,
  name: id.charAt(0) + id.slice(1).toLowerCase(),
  ...config,
  price: id === 'FREE' ? 0 : id === 'BASIC' ? 29 : 99,
}));

export class SubscriptionService {
  static getPlans() {
    return PLANS;
  }

  static async getCurrentPlan(companyId: string) {
    const company = await SubscriptionRepository.getCompanyPlan(companyId);
    if (!company) throw new NotFoundError('Company not found');
    const planConfig = PLAN_LIMITS[company.subscriptionPlan];

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
      plan: company.subscriptionPlan,
      ...planConfig,
      currentMonthBookings,
      employeeCount,
      usagePercent: Math.round((currentMonthBookings / planConfig.monthlyBookings) * 100),
    };
  }

  static async changePlan(companyId: string, newPlan: SubscriptionPlan) {
    if (!['FREE', 'BASIC', 'PREMIUM'].includes(newPlan)) {
      throw new BadRequestError('Invalid plan');
    }

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
