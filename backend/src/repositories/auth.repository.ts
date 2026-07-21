import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

const userInclude = {
  company: true,
  companyRole: { select: { id: true, name: true, description: true, permissions: true } },
} as const;

export class AuthRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: userInclude,
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: userInclude,
    });
  }

  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
      include: userInclude,
    });
  }

  static async createUser(userData: {
    email: string;
    passwordHash?: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatar?: string;
    role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
    googleId?: string;
    emailVerified?: boolean;
    companyName?: string;
    companySlug?: string;
    companyRoleId?: string | null;
  }) {
    const { companyName, companySlug, ...rest } = userData;

    // Use transaction if creating both Company and Company Admin user
    if (userData.role === 'COMPANY_ADMIN' && companyName && companySlug) {
      return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Create company
        const company = await tx.company.create({
          data: {
            name: companyName,
            slug: companySlug.toLowerCase(),
            email: userData.email,
          },
        });

        // Create user and link company
        return tx.user.create({
          data: {
            ...rest,
            email: rest.email.toLowerCase(),
            companyId: company.id,
          },
          include: userInclude,
        });
      });
    }

    // Default: just create the user (e.g. CUSTOMER)
    return prisma.user.create({
      data: {
        ...rest,
        email: rest.email.toLowerCase(),
      },
      include: userInclude,
    });
  }

  static async updateUserVerification(id: string, verified: boolean) {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: verified },
    });
  }

  static async updateUser(id: string, data: { firstName?: string; lastName?: string; email?: string; phone?: string; companyRoleId?: string | null }) {
    const updateData: Record<string, any> = {};
    if (data.firstName !== undefined) updateData.firstName = data.firstName;
    if (data.lastName !== undefined) updateData.lastName = data.lastName;
    if (data.email !== undefined) updateData.email = data.email.toLowerCase();
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.companyRoleId !== undefined) updateData.companyRoleId = data.companyRoleId;

    return prisma.user.update({
      where: { id },
      data: updateData,
      include: userInclude,
    });
  }

  static async updatePassword(id: string, passwordHash: string) {
    return prisma.user.update({
      where: { id },
      data: { passwordHash },
    });
  }

  static async linkGoogleAccount(id: string, googleId: string) {
    return prisma.user.update({
      where: { id },
      data: { googleId, emailVerified: true },
      include: userInclude,
    });
  }
}


