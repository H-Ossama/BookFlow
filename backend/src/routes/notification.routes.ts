import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, NotificationController.getAll);
router.patch('/:id/read', authMiddleware, NotificationController.markRead);
router.patch('/read-all', authMiddleware, NotificationController.markAllRead);

export default router;
