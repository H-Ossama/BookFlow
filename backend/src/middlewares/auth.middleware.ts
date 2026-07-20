import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authConfig } from '../config/auth';
import { UnauthorizedError } from '../utils/errors';
import { JwtPayload } from '../types/auth.types';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Authentication token is missing');
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, authConfig.jwtSecret) as JwtPayload;
      req.user = decoded;
      
      // If the user belongs to a company, preset the companyId for scoping queries
      if (decoded.companyId) {
        req.companyId = decoded.companyId;
      }
      
      next();
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError('Access token has expired');
      }
      throw new UnauthorizedError('Invalid access token');
    }
  } catch (error) {
    next(error);
  }
};

