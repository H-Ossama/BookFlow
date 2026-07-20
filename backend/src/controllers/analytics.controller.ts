import { Request, Response, NextFunction } from 'express';
import { AnalyticsService } from '../services/analytics.service';

export class AnalyticsController {
  static async getDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const { dateFrom, dateTo } = req.query;
      const data = await AnalyticsService.getDashboard(companyId, dateFrom as string | undefined, dateTo as string | undefined);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }
}

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}
