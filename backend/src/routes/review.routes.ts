import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createReviewSchema } from '../validators/review.validator';

const router = Router();

router.get('/', ReviewController.getAll);
router.post('/', authMiddleware, validate(createReviewSchema), ReviewController.create);

export default router;
