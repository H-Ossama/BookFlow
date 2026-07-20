import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    firstName: z.string().min(2, 'First name must be at least 2 characters long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters long'),
    phone: z.string().optional(),
    role: z.enum(['COMPANY_ADMIN', 'CUSTOMER']).default('CUSTOMER'),
    companyName: z.string().min(2, 'Company name must be at least 2 characters long').optional(),
    companySlug: z
      .string()
      .min(2, 'Company slug must be at least 2 characters long')
      .regex(/^[a-z0-9-]+$/, 'Slug must only contain lowercase alphanumeric characters and hyphens')
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (data.role === 'COMPANY_ADMIN') {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company name is required for company admins',
          path: ['companyName'],
        });
      }
      if (!data.companySlug) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company slug is required for company admins',
          path: ['companySlug'],
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

