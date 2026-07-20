import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service';

export class EmployeeController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const employees = await EmployeeService.list(companyId);
      res.json({ status: 'success', data: { employees } });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const employee = await EmployeeService.getById(req.params.id, companyId);
      res.json({ status: 'success', data: { employee } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const result = await EmployeeService.create(companyId, req.user!.role, req.body);
      res.status(201).json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const employee = await EmployeeService.update(req.params.id, companyId, req.user!.role, req.body);
      res.json({ status: 'success', data: { employee } });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      await EmployeeService.delete(req.params.id, companyId, req.user!.role);
      res.json({ status: 'success', message: 'Employee removed' });
    } catch (error) {
      next(error);
    }
  }

  // Working Hours
  static async setWorkingHours(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const result = await EmployeeService.setWorkingHours(req.params.employeeId!, companyId, req.body.schedules || []);
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getWorkingHours(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const hours = await EmployeeService.getWorkingHours(req.params.employeeId!, companyId);
      res.json({ status: 'success', data: { workingHours: hours } });
    } catch (error) {
      next(error);
    }
  }

  // Vacation Days
  static async addVacationDay(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const vacation = await EmployeeService.addVacationDay(req.params.employeeId!, companyId, req.body);
      res.status(201).json({ status: 'success', data: { vacation } });
    } catch (error) {
      next(error);
    }
  }

  static async removeVacationDay(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      await EmployeeService.removeVacationDay(req.params.vacationId!, req.params.employeeId!, companyId);
      res.json({ status: 'success', message: 'Vacation day removed' });
    } catch (error) {
      next(error);
    }
  }
}

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}
