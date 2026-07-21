import { Router } from 'express';
import { WebsiteController } from '../controllers/website.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Public: get full website for customer portal
router.get('/full/:companyId', WebsiteController.getFullWebsite);

// Protected: builder API
router.get('/', authMiddleware, WebsiteController.getSections);
router.get('/theme', authMiddleware, WebsiteController.getTheme);
router.get('/:id', authMiddleware, WebsiteController.getSection);
router.post('/', authMiddleware, WebsiteController.createSection);
router.patch('/reorder', authMiddleware, WebsiteController.reorderSections);
router.patch('/theme', authMiddleware, WebsiteController.updateTheme);
router.patch('/:id', authMiddleware, WebsiteController.updateSection);
router.delete('/:id', authMiddleware, WebsiteController.deleteSection);

export default router;
