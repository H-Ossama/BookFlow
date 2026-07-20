import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().optional(),
  duration: z.number().int().min(5, 'Duration must be at least 5 minutes'),
  price: z.number().min(0, 'Price must be a positive number'),
  color: z.string().optional(),
  isActive: z.boolean().default(true),
});

export const updateServiceSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  duration: z.number().int().min(5).optional(),
  price: z.number().min(0).optional(),
  color: z.string().optional(),
  isActive: z.boolean().optional(),
});
