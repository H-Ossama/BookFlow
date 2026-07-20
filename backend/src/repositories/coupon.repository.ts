import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export class CouponRepository {
  static async findByCompany(companyId: string) {
    return prisma.coupon.findMany({ where: { companyId }, orderBy: { createdAt: 'desc' } });
  }

  static async findById(id: string) {
    return prisma.coupon.findUnique({ where: { id } });
  }

  static async findByCode(code: string, companyId: string) {
    return prisma.coupon.findFirst({ where: { code, companyId } });
  }

  static async create(data: Prisma.CouponCreateInput) {
    return prisma.coupon.create({ data });
  }

  static async update(id: string, data: Prisma.CouponUpdateInput) {
    return prisma.coupon.update({ where: { id }, data });
  }
}
