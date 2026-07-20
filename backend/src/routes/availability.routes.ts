import { Router } from 'express';
import { AvailabilityController } from '../controllers/availability.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/v1/availability:
 *   get:
 *     summary: Get available time slots for an employee on a given date
 *     parameters:
 *       - in: query
 *         name: companyId
 *         required: true
 *       - in: query
 *         name: employeeId
 *         required: true
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 */
router.get('/', authMiddleware, AvailabilityController.getSlots);

export default router;
