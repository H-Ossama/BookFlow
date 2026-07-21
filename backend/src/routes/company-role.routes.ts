import { Router } from 'express';
import { CompanyRoleController } from '../controllers/company-role.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCompanyRoleSchema, updateCompanyRoleSchema } from '../validators/company-role.validator';

const router = Router();

router.use(authMiddleware);
router.use(checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']));

router.get('/', CompanyRoleController.getAll);
router.get('/:id', CompanyRoleController.getById);
router.post('/', validate(createCompanyRoleSchema), CompanyRoleController.create);
router.patch('/:id', validate(updateCompanyRoleSchema), CompanyRoleController.update);
router.delete('/:id', CompanyRoleController.delete);

export default router;
