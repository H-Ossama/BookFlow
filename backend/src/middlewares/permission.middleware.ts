import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export const checkPermission = (...permissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    // SUPER_ADMIN and COMPANY_ADMIN have access to everything
    if (req.user.role === 'SUPER_ADMIN' || req.user.role === 'COMPANY_ADMIN') {
      return next();
    }

    // EMPLOYEE users need specific permissions
    if (req.user.role === 'EMPLOYEE') {
      const userPermissions = req.user.permissions || [];
      const hasAll = permissions.every((p) => userPermissions.includes(p));
      if (!hasAll) {
        return next(new ForbiddenError('You do not have permission to perform this action'));
      }
      return next();
    }

    // CUSTOMER and other roles
    return next(new ForbiddenError('You do not have permission to perform this action'));
  };
};
