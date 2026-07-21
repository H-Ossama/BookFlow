import { z } from 'zod';

export const ALL_PERMISSIONS = [
  'dashboard',
  'bookings',
  'services',
  'employees',
  'coupons',
  'reviews',
  'reports',
  'subscription',
  'settings',
] as const;

export type Permission = typeof ALL_PERMISSIONS[number];

export const createCompanyRoleSchema = z.object({
  name: z.string().min(2, 'Role name must be at least 2 characters').max(50),
  description: z.string().optional(),
  permissions: z.array(z.enum(ALL_PERMISSIONS)).default([]),
});

export const updateCompanyRoleSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  description: z.string().optional(),
  permissions: z.array(z.enum(ALL_PERMISSIONS)).optional(),
});
