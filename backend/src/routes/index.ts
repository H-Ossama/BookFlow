import { Router } from 'express';
import authRoutes from './auth.routes';
import companyRoutes from './company.routes';
import serviceRoutes from './service.routes';
import employeeRoutes from './employee.routes';
import bookingRoutes from './booking.routes';
import availabilityRoutes from './availability.routes';
import customerRoutes from './customer.routes';
import reviewRoutes from './review.routes';
import couponRoutes from './coupon.routes';
import analyticsRoutes from './analytics.routes';
import notificationRoutes from './notification.routes';
import subscriptionRoutes from './subscription.routes';
import adminRoutes from './admin.routes';
import reportRoutes from './report.routes';

const router = Router();
router.use('/auth', authRoutes);
router.use('/company', companyRoutes);
router.use('/service', serviceRoutes);
router.use('/employee', employeeRoutes);
router.use('/booking', bookingRoutes);
router.use('/availability', availabilityRoutes);
router.use('/customer', customerRoutes);
router.use('/review', reviewRoutes);
router.use('/coupon', couponRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notification', notificationRoutes);
router.use('/subscription', subscriptionRoutes);
router.use('/admin', adminRoutes);
router.use('/report', reportRoutes);

export default router;

