import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';

export class ReviewController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const data = await ReviewService.list(companyId);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await ReviewService.create(req.user!.userId, req.body);
      res.status(201).json({ status: 'success', data: { review } });
    } catch (error) {
      next(error);
    }
  }
}

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}
