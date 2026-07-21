import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/rbac.middleware';

const router = Router();

router.use(authMiddleware, checkRole(['SUPER_ADMIN']));

router.get('/dashboard', AdminController.getDashboard);
router.get('/companies', AdminController.getCompanies);
router.get('/platform-stats', AdminController.getPlatformStats);
router.get('/companies/:id', AdminController.getCompanyDetail);
router.patch('/companies/:id', AdminController.updateCompany);
router.delete('/companies/:id', AdminController.deleteCompany);
router.get('/companies/:id/revenue', AdminController.getCompanyRevenue);

router.get('/plans', AdminController.getPlans);
router.post('/plans', AdminController.createPlan);
router.patch('/plans/:id', AdminController.updatePlan);
router.delete('/plans/:id', AdminController.deletePlan);

router.get('/coupons', AdminController.getCoupons);
router.post('/coupons', AdminController.createCoupon);
router.patch('/coupons/:id', AdminController.updateCoupon);
router.delete('/coupons/:id', AdminController.deleteCoupon);

router.get('/features', AdminController.getFeatures);
router.post('/features', AdminController.createFeature);
router.patch('/features/:id', AdminController.updateFeature);
router.delete('/features/:id', AdminController.deleteFeature);

export default router;
