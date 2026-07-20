import { Router } from 'express';
import { SubscriptionController } from '../controllers/subscription.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/plans', SubscriptionController.getPlans);
router.get('/current', authMiddleware, SubscriptionController.getCurrent);
router.patch('/change', authMiddleware, SubscriptionController.changePlan);

export default router;
