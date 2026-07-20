import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';

export class BookingController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { companyId, employeeId, customerId, status, dateFrom, dateTo, page, limit } = req.query;
      const result = await BookingService.list({
        companyId: companyId as string | undefined,
        employeeId: employeeId as string | undefined,
        customerId: req.user?.role === 'CUSTOMER' ? req.user.userId : (customerId as string | undefined),
        status: status as any,
        dateFrom: dateFrom as string | undefined,
        dateTo: dateTo as string | undefined,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
      });
      res.json({ status: 'success', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.getById(req.params.id, req.user!.userId, req.user!.role);
      res.json({ status: 'success', data: { booking } });
    } catch (error) {
      next(error);
    }
  }

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.create({
        customerId: req.body.customerId || req.user!.userId,
        employeeId: req.body.employeeId,
        serviceId: req.body.serviceId,
        companyId: req.body.companyId,
        date: req.body.date,
        startTime: req.body.startTime,
        notes: req.body.notes,
        couponCode: req.body.couponCode,
      });
      res.status(201).json({ status: 'success', data: { booking } });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.updateStatus(req.params.id, req.body.status, req.user!.role);
      res.json({ status: 'success', data: { booking } });
    } catch (error) {
      next(error);
    }
  }

  static async reschedule(req: Request, res: Response, next: NextFunction) {
    try {
      const booking = await BookingService.reschedule(req.params.id, req.user!.role, req.body);
      res.json({ status: 'success', data: { booking } });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await BookingService.delete(req.params.id, req.user!.role);
      res.json({ status: 'success', message: 'Booking removed' });
    } catch (error) {
      next(error);
    }
  }
}
