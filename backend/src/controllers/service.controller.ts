import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';

export class ServiceController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, page, limit } = req.query;
      if (!companyId) {
        return res.status(400).json({ status: 'error', message: 'companyId query parameter is required' });
      }
      const result = await ServiceService.list(companyId as string, {
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
      });
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const service = await ServiceService.getById(req.params.id);
      res.json({ status: 'success', data: { service } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.body.companyId || req.companyId;
      if (!companyId) {
        return res.status(400).json({ status: 'error', message: 'companyId is required' });
      }
      const service = await ServiceService.create(companyId, req.user!.userId, req.user!.role, req.body);
      res.status(201).json({ status: 'success', data: { service } });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.body.companyId || req.companyId;
      if (!companyId) {
        return res.status(400).json({ status: 'error', message: 'companyId is required' });
      }
      const service = await ServiceService.update(req.params.id, companyId, req.user!.userId, req.user!.role, req.body);
      res.json({ status: 'success', data: { service } });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = (req.query.companyId as string) || req.companyId;
      if (!companyId) {
        return res.status(400).json({ status: 'error', message: 'companyId is required' });
      }
      await ServiceService.delete(req.params.id, companyId, req.user!.userId, req.user!.role);
      res.json({ status: 'success', message: 'Service deleted' });
    } catch (error) {
      next(error);
    }
  }
}
