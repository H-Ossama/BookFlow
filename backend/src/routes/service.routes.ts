import { Router } from 'express';
import { ServiceController } from '../controllers/service.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator';

const router = Router();

router.get('/', ServiceController.getAll);
router.get('/:id', ServiceController.getById);
router.post('/', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(createServiceSchema), ServiceController.create);
router.patch('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(updateServiceSchema), ServiceController.update);
router.delete('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), ServiceController.delete);

export default router;
