import { Request, Response, NextFunction } from 'express';
import { CompanyService } from '../services/company.service';

export class CompanyController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, search } = req.query;
      const result = await CompanyService.list({
        page: page ? Number(page) : undefined,
        limit: limit ? Number(limit) : undefined,
        search: search as string,
      });
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await CompanyService.getBySlug(req.params.slug);
      res.json({ status: 'success', data: { company } });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const company = await CompanyService.getById(req.params.id);
      res.json({ status: 'success', data: { company } });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const userRole = req.user!.role;
      const company = await CompanyService.update(req.params.id, userId, userRole, req.body);
      res.json({ status: 'success', data: { company } });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await CompanyService.delete(req.params.id, req.user!.role);
      res.json({ status: 'success', message: 'Company deleted' });
    } catch (error) {
      next(error);
    }
  }
}
