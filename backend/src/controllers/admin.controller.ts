import type { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getDashboard();
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search, plan, isActive } = req.query;
      const data = await AdminService.getCompanies({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string | undefined,
        plan: plan as string | undefined,
        isActive: isActive as string | undefined,
      });
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getPlatformStats(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getPlatformStats();
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getCompanyDetail(req.params.id);
      if (!data) return res.status(404).json({ status: 'error', message: 'Company not found' });
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async updateCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.updateCompany(req.params.id, req.body);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCompany(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.deleteCompany(req.params.id);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await AdminService.getPlans();
      res.json({ status: 'success', data: { plans } });
    } catch (error) {
      next(error);
    }
  }

  static async createPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await AdminService.createPlan(req.body);
      res.status(201).json({ status: 'success', data: { plan } });
    } catch (error) {
      next(error);
    }
  }

  static async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const plan = await AdminService.updatePlan(req.params.id, req.body);
      res.json({ status: 'success', data: { plan } });
    } catch (error) {
      next(error);
    }
  }

  static async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deletePlan(req.params.id);
      res.json({ status: 'success', message: 'Plan deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await AdminService.getCoupons();
      res.json({ status: 'success', data: { coupons } });
    } catch (error) {
      next(error);
    }
  }

  static async createCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await AdminService.createCoupon(req.body);
      res.status(201).json({ status: 'success', data: { coupon } });
    } catch (error) {
      next(error);
    }
  }

  static async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await AdminService.updateCoupon(req.params.id, req.body);
      res.json({ status: 'success', data: { coupon } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteCoupon(req.params.id);
      res.json({ status: 'success', message: 'Coupon deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getFeatures(req: Request, res: Response, next: NextFunction) {
    try {
      const features = await AdminService.getFeatures();
      res.json({ status: 'success', data: { features } });
    } catch (error) {
      next(error);
    }
  }

  static async createFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const feature = await AdminService.createFeature(req.body);
      res.status(201).json({ status: 'success', data: { feature } });
    } catch (error) {
      next(error);
    }
  }

  static async updateFeature(req: Request, res: Response, next: NextFunction) {
    try {
      const feature = await AdminService.updateFeature(req.params.id, req.body);
      res.json({ status: 'success', data: { feature } });
    } catch (error) {
      next(error);
    }
  }

  static async deleteFeature(req: Request, res: Response, next: NextFunction) {
    try {
      await AdminService.deleteFeature(req.params.id);
      res.json({ status: 'success', message: 'Feature deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanyRevenue(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await AdminService.getCompanyRevenue(req.params.id);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}
