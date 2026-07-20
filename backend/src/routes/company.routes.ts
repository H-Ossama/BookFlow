import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { updateCompanySchema } from '../validators/company.validator';

const router = Router();

router.get('/', CompanyController.getAll);
router.get('/slug/:slug', CompanyController.getBySlug);
router.get('/:id', CompanyController.getById);
router.patch('/:id', authMiddleware, validate(updateCompanySchema), CompanyController.update);
router.delete('/:id', authMiddleware, checkRole(['SUPER_ADMIN']), CompanyController.delete);

export default router;
