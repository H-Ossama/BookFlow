import { ReviewRepository } from '../repositories/review.repository';
import { BookingRepository } from '../repositories/booking.repository';
import { NotFoundError, ConflictError } from '../utils/errors';

export class ReviewService {
  static async list(companyId: string) {
    const [reviews, ratingStats] = await Promise.all([
      ReviewRepository.findByCompany(companyId),
      ReviewRepository.getAverageRating(companyId),
    ]);
    return { reviews, ...ratingStats };
  }

  static async create(customerId: string, data: { bookingId: string; companyId: string; rating: number; comment?: string }) {
    const booking = await BookingRepository.findById(data.bookingId);
    if (!booking) throw new NotFoundError('Booking not found');
    if (booking.customerId !== customerId) throw new NotFoundError('Booking not found');
    if (booking.status !== 'COMPLETED') throw new NotFoundError('Can only review completed bookings');

    const existing = await ReviewRepository.findByBooking(data.bookingId);
    if (existing) throw new ConflictError('Booking already reviewed');

    return ReviewRepository.create({ ...data, customerId });
  }
}
