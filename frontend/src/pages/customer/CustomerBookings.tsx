import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { bookingsApi } from '../../api/bookings.api';
import { reviewsApi } from '../../api/reviews.api';
import type { Booking, BookingStatus } from '../../types/booking.types';
import toast from 'react-hot-toast';
import { Clock, User, Star, X } from 'lucide-react';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  COMPLETED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REJECTED: 'text-gray-400 bg-gray-400/10',
};

export function CustomerBookings() {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModal, setReviewModal] = useState<{ bookingId: string; companyId: string } | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    bookingsApi.getAll({ customerId: user.id, limit: 50 })
      .then((r) => setBookings(r.bookings))
      .catch(() => toast.error('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCancel = async (id: string) => {
    try {
      await bookingsApi.updateStatus(id, 'CANCELLED');
      toast.success('Booking cancelled');
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' as BookingStatus } : b));
    } catch {
      toast.error('Failed to cancel');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewModal || rating === 0) return;
    setSubmitting(true);
    try {
      await reviewsApi.create({ bookingId: reviewModal.bookingId, companyId: reviewModal.companyId, rating, comment });
      toast.success('Review submitted');
      setReviewModal(null);
      setRating(0);
      setComment('');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[40vh]"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 mt-1">Your appointment history</p>
      </div>

      {bookings.length === 0 && (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No bookings yet</p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((b) => (
          <div key={b.id} className="bg-[#121620] border border-white/5 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium">
                  {b.employee.user.firstName[0]}{b.employee.user.lastName[0]}
                </div>
                <div>
                  <p className="text-white font-medium">{b.service.name}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <User className="h-3 w-3" /> {b.employee.user.firstName} {b.employee.user.lastName}
                    <Clock className="h-3 w-3" /> {b.date.split('T')[0]} at {b.startTime}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span>${b.totalPrice.toFixed(2)}</span>
                    {b.discountAmount > 0 && <span className="text-green-400">-${b.discountAmount.toFixed(2)}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                {b.status === 'PENDING' && (
                  <button onClick={() => handleCancel(b.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors cursor-pointer">Cancel</button>
                )}
                {b.status === 'COMPLETED' && (
                  <button onClick={() => setReviewModal({ bookingId: b.id, companyId: b.companyId })} className="flex items-center gap-1 text-xs text-[#c5a880] hover:text-[#d6ba93] transition-colors cursor-pointer">
                    <Star className="h-3 w-3" /> Review
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {reviewModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">Write a Review</h2>
              <button onClick={() => setReviewModal(null)} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="flex items-center gap-1 mb-4 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="cursor-pointer"
                >
                  <Star className={`h-8 w-8 transition-colors ${star <= (hoverRating || rating) ? 'fill-[#c5a880] text-[#c5a880]' : 'text-gray-600'}`} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience (optional)" rows={3}
              className="w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] resize-none mb-4" />
            <button onClick={handleSubmitReview} disabled={rating === 0 || submitting}
              className="w-full py-2.5 rounded-lg bg-[#c5a880] text-[#0a0c10] font-semibold hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerBookings;
