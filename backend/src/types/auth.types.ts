import { Role } from '@prisma/client';

export interface JwtPayload {
  userId: string;
  role: Role;
  companyId: string | null;
  companyRoleId?: string | null;
  permissions?: string[];
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

declare global {
  namespace Express {
    // Passport attaches user to req.user; extend the User interface so all middleware is typed correctly
    interface User extends JwtPayload {}

    interface Request {
      companyId?: string; // For multi-tenant middleware scoping
    }
  }
}
