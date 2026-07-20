import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @openapi
 * /report/bookings/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export bookings as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: CSV file
 * /report/bookings/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export bookings as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Excel file
 * /report/bookings/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export bookings as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateFrom
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: dateTo
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: PDF file
 */
router.get('/bookings/csv', authMiddleware, ReportController.bookingsCSV);
router.get('/bookings/excel', authMiddleware, ReportController.bookingsExcel);
router.get('/bookings/pdf', authMiddleware, ReportController.bookingsPDF);
router.get('/revenue/csv', authMiddleware, ReportController.revenueCSV);
router.get('/revenue/pdf', authMiddleware, ReportController.revenuePDF);
router.get('/customers/csv', authMiddleware, ReportController.customersCSV);

export default router;
