import { Request, Response, NextFunction } from 'express';
import { CustomerService } from '../services/customer.service';

export class CustomerController {
  // TODO: Implement controller methods
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      res.json({ message: 'getAll customer - not implemented' });
    } catch (error) {
      next(error);
    }
  }
}

