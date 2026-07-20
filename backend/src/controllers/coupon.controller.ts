import { Request, Response, NextFunction } from 'express';
import { CouponService } from '../services/coupon.service';

export class CouponController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const coupons = await CouponService.list(companyId);
      res.json({ status: 'success', data: { coupons } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const coupon = await CouponService.create(companyId, req.user!.role, req.body);
      res.status(201).json({ status: 'success', data: { coupon } });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const coupon = await CouponService.update(req.params.id, companyId, req.user!.role, req.body);
      res.json({ status: 'success', data: { coupon } });
    } catch (error) {
      next(error);
    }
  }
}

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}
