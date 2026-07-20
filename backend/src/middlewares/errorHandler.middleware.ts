import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || null;

  // Handle specific database errors (like Prisma unique constraint violations)
  if (err.code === 'P2002') {
    statusCode = 409;
    message = 'Unique constraint violation: A record with this value already exists.';
    const fields = err.meta?.target || [];
    errors = fields.map((f: string) => ({ field: f, message: `${f} must be unique` }));
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = err.errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
  }

  res.status(statusCode).json({
    status: 'error',
    message,
    ...(errors && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
}


