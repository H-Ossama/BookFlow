import { prisma } from '../config/database';
import type { SubscriptionPlan } from '@prisma/client';

export class SubscriptionRepository {
  static async findByCompany(companyId: string) {
    return prisma.subscription.findFirst({
      where: { companyId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createOrUpdate(companyId: string, data: {
    plan: SubscriptionPlan;
    status: string;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    stripeSubscriptionId?: string;
  }) {
    const existing = await prisma.subscription.findFirst({ where: { companyId } });
    if (existing) {
      return prisma.subscription.update({
        where: { id: existing.id },
        data,
      });
    }
    return prisma.subscription.create({
      data: { ...data, companyId },
    });
  }

  static async getCompanyPlan(companyId: string) {
    return prisma.company.findUnique({
      where: { id: companyId },
      select: { subscriptionPlan: true },
    });
  }
}
