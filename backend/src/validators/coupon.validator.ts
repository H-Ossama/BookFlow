import { z } from 'zod';

export const createCouponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').toUpperCase(),
  discountPercent: z.number().min(1).max(100),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format').optional(),
});

export const updateCouponSchema = z.object({
  code: z.string().min(3).toUpperCase().optional(),
  discountPercent: z.number().min(1).max(100).optional(),
  maxUses: z.number().int().positive().optional(),
  expiresAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  isActive: z.boolean().optional(),
});
