import { Router } from 'express';
import { BookingController } from '../controllers/booking.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createBookingSchema, updateBookingStatusSchema, rescheduleBookingSchema } from '../validators/booking.validator';

const router = Router();

/**
 * @openapi
 * /booking:
 *   get:
 *     tags: [Bookings]
 *     summary: List bookings with filters
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: companyId
 *         schema:
 *           type: string
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, CONFIRMED, COMPLETED, CANCELLED, REJECTED]
 *       - in: query
 *         name: dateFrom
 *         schema:
 *           type: string
 *       - in: query
 *         name: dateTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Paginated bookings
 *   post:
 *     tags: [Bookings]
 *     summary: Create a booking
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               companyId: { type: string }
 *               employeeId: { type: string }
 *               serviceId: { type: string }
 *               date: { type: string }
 *               startTime: { type: string }
 *               notes: { type: string }
 *               couponCode: { type: string }
 *     responses:
 *       201:
 *         description: Booking created
 */
router.get('/', authMiddleware, BookingController.getAll);
router.get('/:id', authMiddleware, BookingController.getById);
router.post('/', authMiddleware, validate(createBookingSchema), BookingController.create);
router.patch('/:id/status', authMiddleware, validate(updateBookingStatusSchema), BookingController.updateStatus);
router.patch('/:id/reschedule', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(rescheduleBookingSchema), BookingController.reschedule);
router.delete('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), BookingController.delete);

export default router;
