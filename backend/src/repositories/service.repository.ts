import { prisma } from '../config/database';
import type { Prisma } from '@prisma/client';

export class ServiceRepository {
  static async findAll(companyId: string, params: { page?: number; limit?: number }) {
    const { page = 1, limit = 20 } = params;
    const where: Prisma.ServiceWhereInput = { companyId };

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { name: 'asc' },
      }),
      prisma.service.count({ where }),
    ]);

    return { services, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async findById(id: string) {
    return prisma.service.findUnique({ where: { id } });
  }

  static async create(data: Prisma.ServiceCreateInput) {
    return prisma.service.create({ data });
  }

  static async update(id: string, data: Prisma.ServiceUpdateInput) {
    return prisma.service.update({ where: { id }, data });
  }

  static async delete(id: string) {
    return prisma.service.delete({ where: { id } });
  }
}
