import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export class CompanyRepository {
  static async findAll(params: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 10, search } = params;
    const where: Prisma.CompanyWhereInput = search
      ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { slug: { contains: search, mode: 'insensitive' } }] }
      : {};

    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { _count: { select: { services: true, employees: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.company.count({ where }),
    ]);

    return { companies, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findBySlug(slug: string) {
    return prisma.company.findUnique({
      where: { slug },
      include: { services: { where: { isActive: true } }, _count: { select: { reviews: true } } },
    });
  }

  static async findById(id: string) {
    return prisma.company.findUnique({ where: { id } });
  }

  static async update(id: string, data: Prisma.CompanyUpdateInput) {
    return prisma.company.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.company.delete({ where: { id } });
  }
}
