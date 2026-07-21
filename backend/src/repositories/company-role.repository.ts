import { prisma } from '../config/database';

export class CompanyRoleRepository {
  static async findAll(companyId: string) {
    return prisma.companyRole.findMany({
      where: { companyId },
      include: { _count: { select: { users: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  static async findById(id: string) {
    return prisma.companyRole.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
  }

  static async create(companyId: string, data: { name: string; description?: string; permissions: any; isDefault?: boolean }) {
    return prisma.companyRole.create({
      data: { ...data, companyId },
    });
  }

  static async update(id: string, data: { name?: string; description?: string; permissions?: any }) {
    return prisma.companyRole.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string) {
    await prisma.user.updateMany({
      where: { companyRoleId: id },
      data: { companyRoleId: null },
    });
    return prisma.companyRole.delete({ where: { id } });
  }
}
