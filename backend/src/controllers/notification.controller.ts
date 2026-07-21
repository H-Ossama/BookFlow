import { Request, Response, NextFunction } from 'express';
import { NotificationService } from '../services/notification.service';

export class NotificationController {
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 50));
      const data = await NotificationService.list(req.user!.userId, page, limit);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await NotificationService.getUnreadCount(req.user!.userId);
      res.json({ status: 'success', data });
    } catch (error) {
      next(error);
    }
  }

  static async markRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markRead(req.params.id, req.user!.userId);
      res.json({ status: 'success', message: 'Notification marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async markAllRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationService.markAllRead(req.user!.userId);
      res.json({ status: 'success', message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }
}
