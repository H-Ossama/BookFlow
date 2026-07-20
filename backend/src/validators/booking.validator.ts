import { z } from 'zod';

export const createBookingSchema = z.object({
  employeeId: z.string().uuid('Invalid employee ID'),
  serviceId: z.string().uuid('Invalid service ID'),
  companyId: z.string().uuid('Invalid company ID'),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format'),
  notes: z.string().optional(),
  couponCode: z.string().optional(),
});

export const updateBookingStatusSchema = z.object({
  status: z.enum(['CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']),
});

export const rescheduleBookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Must be HH:mm format'),
});

export const bookingQuerySchema = z.object({
  companyId: z.string().uuid().optional(),
  employeeId: z.string().uuid().optional(),
  customerId: z.string().uuid().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED']).optional(),
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  limit: z.coerce.number().int().positive().max(100).optional().default(20),
});
