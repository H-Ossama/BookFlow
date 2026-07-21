import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, NotificationController.getAll);
router.get('/unread-count', authMiddleware, NotificationController.getUnreadCount);
router.patch('/read-all', authMiddleware, NotificationController.markAllRead);
router.patch('/:id/read', authMiddleware, NotificationController.markRead);

export default router;
