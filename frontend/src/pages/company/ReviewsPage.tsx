import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { reviewsApi, type Review } from '../../api/reviews.api';
import { Star } from 'lucide-react';

export function ReviewsPage() {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const companyId = user?.companyId;

  useEffect(() => {
    if (!companyId) return;
    reviewsApi.getAll(companyId).then((data) => {
      setReviews(data.reviews);
      setAverage(data.average);
      setTotal(data.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Reviews</h1>
        <p className="text-gray-400 mt-1">Customer feedback</p>
      </div>

      {/* Rating Summary */}
      <div className="bg-[#121620] border border-white/5 rounded-xl p-6 flex items-center gap-6">
        <div className="text-center">
          <p className="text-4xl font-bold text-white">{average.toFixed(1)}</p>
          <div className="flex items-center gap-0.5 mt-1 justify-center">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-4 w-4 ${s <= Math.round(average) ? 'text-[#c5a880] fill-[#c5a880]' : 'text-gray-600'}`} />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">{total} reviews</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length;
            const pct = total > 0 ? (count / total) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2 text-sm">
                <span className="text-gray-400 w-3">{star}</span>
                <Star className="h-3 w-3 text-[#c5a880]" />
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-[#c5a880] rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-gray-500 w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review List */}
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No reviews yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="bg-[#121620] border border-white/5 rounded-xl p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">{r.booking.service.name}</span>
                <span className="text-[10px] text-gray-600">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'text-[#c5a880] fill-[#c5a880]' : 'text-gray-600'}`} />
                ))}
              </div>
              {r.comment && <p className="text-sm text-gray-300">{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
