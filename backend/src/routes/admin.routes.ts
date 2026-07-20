import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';

const router = Router();

/**
 * @swagger
 * /api/v1/admin:
 *   get:
 *     description: Get all
 */
router.get('/', AdminController.getAll);

// TODO: Add more routes

export default router;

