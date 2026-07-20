import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/report.service';

function resolveCompanyId(req: Request): string | undefined {
  return (req.query.companyId as string) || req.body.companyId || req.companyId || undefined;
}

export class ReportController {
  static async bookingsCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const csv = await ReportService.getBookingsCSV(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.csv');
      res.send(csv);
    } catch (error) { next(error); }
  }

  static async bookingsExcel(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const buf = await ReportService.getBookingsExcel(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.xlsx');
      res.send(buf);
    } catch (error) { next(error); }
  }

  static async bookingsPDF(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const buf = await ReportService.getBookingsPDF(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=bookings.pdf');
      res.send(buf);
    } catch (error) { next(error); }
  }

  static async revenueCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const csv = await ReportService.getRevenueCSV(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=revenue.csv');
      res.send(csv);
    } catch (error) { next(error); }
  }

  static async revenuePDF(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const buf = await ReportService.getRevenuePDF(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=revenue.pdf');
      res.send(buf);
    } catch (error) { next(error); }
  }

  static async customersCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = resolveCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const csv = await ReportService.getCustomersCSV(companyId, req.query.dateFrom as string, req.query.dateTo as string);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=customers.csv');
      res.send(csv);
    } catch (error) { next(error); }
  }
}
