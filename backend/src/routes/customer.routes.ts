import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/customer:
 *   get:
 *     description: Get all
 */
router.get('/', CustomerController.getAll);

// TODO: Add more routes

export default router;

