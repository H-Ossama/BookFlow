import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';

export class SubscriptionController {
  static async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = SubscriptionService.getPlans();
      res.json({ status: 'success', data: { plans } });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrent(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId required' });
      const current = await SubscriptionService.getCurrentPlan(companyId);
      res.json({ status: 'success', data: current });
    } catch (error) {
      next(error);
    }
  }

  static async changePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId required' });
      const result = await SubscriptionService.changePlan(companyId, req.body.plan);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }
}

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}
