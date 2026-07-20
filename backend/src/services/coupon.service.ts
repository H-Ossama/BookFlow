import { CouponRepository } from '../repositories/coupon.repository';
import { NotFoundError, ConflictError, BadRequestError, ForbiddenError } from '../utils/errors';

export class CouponService {
  static async list(companyId: string) {
    return CouponRepository.findByCompany(companyId);
  }

  static async create(companyId: string, requesterRole: string, data: { code: string; discountPercent: number; maxUses?: number; expiresAt?: string }) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only admins can create coupons');
    }
    const existing = await CouponRepository.findByCode(data.code, companyId);
    if (existing) throw new ConflictError('Coupon code already exists');
    return CouponRepository.create({
      code: data.code,
      discountPercent: data.discountPercent,
      maxUses: data.maxUses,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
      company: { connect: { id: companyId } },
    });
  }

  static async update(id: string, companyId: string, requesterRole: string, data: any) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only admins can update coupons');
    }
    const coupon = await CouponRepository.findById(id);
    if (!coupon || coupon.companyId !== companyId) throw new NotFoundError('Coupon not found');
    return CouponRepository.update(id, data);
  }
}
