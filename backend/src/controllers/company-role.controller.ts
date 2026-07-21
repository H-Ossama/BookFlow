import { Request, Response, NextFunction } from 'express';
import { CompanyRoleService } from '../services/company-role.service';

export class CompanyRoleController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.companyId!;
      const roles = await CompanyRoleService.list(companyId);
      res.json({ status: 'success', data: { roles } });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.companyId!;
      const role = await CompanyRoleService.getById(req.params.id, companyId);
      res.json({ status: 'success', data: { role } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.companyId!;
      const role = await CompanyRoleService.create(companyId, req.body);
      res.status(201).json({ status: 'success', data: { role } });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.companyId!;
      const role = await CompanyRoleService.update(req.params.id, companyId, req.body);
      res.json({ status: 'success', data: { role } });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.companyId!;
      await CompanyRoleService.delete(req.params.id, companyId);
      res.json({ status: 'success', message: 'Role deleted' });
    } catch (error) {
      next(error);
    }
  }
}
