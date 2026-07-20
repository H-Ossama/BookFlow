import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/admin.service';

export class AdminController {
  // TODO: Implement controller methods
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ message: 'getAll admin - not implemented' });
    } catch (error) {
      next(error);
    }
  }
}

