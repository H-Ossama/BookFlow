import { Router } from 'express';
import { CouponController } from '../controllers/coupon.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCouponSchema, updateCouponSchema } from '../validators/coupon.validator';

const router = Router();

router.get('/', authMiddleware, CouponController.getAll);
router.post('/', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(createCouponSchema), CouponController.create);
router.patch('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(updateCouponSchema), CouponController.update);

export default router;
