import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

export const tenantMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const tenantIdHeader = req.headers['x-company-id'] || req.headers['x-tenant-id'];

    if (req.user) {
      // If user is company admin or employee, enforce their tenant
      if (req.user.role === 'COMPANY_ADMIN' || req.user.role === 'EMPLOYEE') {
        if (req.user.companyId) {
          req.companyId = req.user.companyId;
        } else {
          throw new BadRequestError('User is not associated with any company');
        }
      } else if (req.user.role === 'SUPER_ADMIN') {
        // Super Admin can act on behalf of any tenant via header
        if (tenantIdHeader) {
          req.companyId = tenantIdHeader as string;
        }
      } else {
        // Customers can specify tenant via header
        if (tenantIdHeader) {
          req.companyId = tenantIdHeader as string;
        }
      }
    } else {
      // Unauthenticated users (e.g., browsing public services)
      if (tenantIdHeader) {
        req.companyId = tenantIdHeader as string;
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

