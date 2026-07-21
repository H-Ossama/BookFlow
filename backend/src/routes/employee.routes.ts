import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createEmployeeSchema, updateEmployeeSchema, workingHoursSchema, vacationDaySchema } from '../validators/employee.validator';

const router = Router();

router.get('/', EmployeeController.getAll);
router.get('/:id', EmployeeController.getById);
router.post('/', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(createEmployeeSchema), EmployeeController.create);
router.patch('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(updateEmployeeSchema), EmployeeController.update);
router.delete('/:id', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), EmployeeController.delete);

// Working Hours
router.get('/:employeeId/working-hours', authMiddleware, EmployeeController.getWorkingHours);
router.put('/:employeeId/working-hours', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), EmployeeController.setWorkingHours);

// Vacation Days
router.post('/:employeeId/vacations', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), validate(vacationDaySchema), EmployeeController.addVacationDay);
router.delete('/:employeeId/vacations/:vacationId', authMiddleware, checkRole(['COMPANY_ADMIN', 'SUPER_ADMIN']), EmployeeController.removeVacationDay);

export default router;
