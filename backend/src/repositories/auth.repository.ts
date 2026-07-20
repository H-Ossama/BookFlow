import { prisma } from '../config/database';
import { Prisma } from '@prisma/client';

export class AuthRepository {
  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { company: true },
    });
  }

  static async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      include: { company: true },
    });
  }

  static async findByGoogleId(googleId: string) {
    return prisma.user.findUnique({
      where: { googleId },
      include: { company: true },
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
          include: { company: true },
        });
      });
    }

    // Default: just create the user (e.g. CUSTOMER)
    return prisma.user.create({
      data: {
        ...rest,
        email: rest.email.toLowerCase(),
      },
      include: { company: true },
    });
  }

  static async updateUserVerification(id: string, verified: boolean) {
    return prisma.user.update({
      where: { id },
      data: { emailVerified: verified },
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
      include: { company: true },
    });
  }
}


