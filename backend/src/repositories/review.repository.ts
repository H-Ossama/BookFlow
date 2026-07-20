import { prisma } from '../config/database';

export class ReviewRepository {
  static async findByCompany(companyId: string) {
    return prisma.review.findMany({
      where: { companyId },
      include: {
        booking: { select: { id: true, service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async findByBooking(bookingId: string) {
    return prisma.review.findUnique({ where: { bookingId } });
  }

  static async create(data: { customerId: string; bookingId: string; companyId: string; rating: number; comment?: string }) {
    return prisma.review.create({ data });
  }

  static async getAverageRating(companyId: string) {
    const result = await prisma.review.aggregate({
      where: { companyId },
      _avg: { rating: true },
      _count: { id: true },
    });
    return { average: result._avg.rating || 0, total: result._count.id };
  }
}
