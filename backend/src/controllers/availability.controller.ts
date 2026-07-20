import { Request, Response, NextFunction } from 'express';
import { AvailabilityService } from '../services/availability.service';

export class AvailabilityController {
  static async getSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, employeeId, date } = req.query;
      if (!companyId || !employeeId || !date) {
        return res.status(400).json({ status: 'error', message: 'companyId, employeeId, and date are required' });
      }
      const slots = await AvailabilityService.getAvailableSlots(
        companyId as string,
        employeeId as string,
        date as string,
      );
      res.json({ status: 'success', data: { slots } });
    } catch (error) {
      next(error);
    }
  }
}
