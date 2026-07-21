import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { reviewsApi, type Review } from '../../api/reviews.api';
import { Star, MessageSquare, ThumbsUp, TrendingUp, CalendarDays, Quote } from 'lucide-react';

export function ReviewsPage() {
  const { user } = useAuthContext();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');
  const companyId = user?.companyId;

  useEffect(() => {
    if (!companyId) return;
    reviewsApi.getAll(companyId).then((data) => {
      setReviews(data.reviews);
      setAverage(data.average);
      setTotal(data.total);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [companyId]);

  const sorted = [...reviews].sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sortBy === 'highest') return b.rating - a.rating;
    return a.rating - b.rating;
  });

  const distribution = [5, 4, 3, 2, 1].map((star) => {
    const count = reviews.filter((r) => r.rating === star).length;
    const pct = total > 0 ? (count / total) * 100 : 0;
    return { star, count, pct };
  });

  const fiveStarPct = total > 0 ? (distribution[0].count / total) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Reviews</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Customer feedback and satisfaction</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6 text-center">
          <p className="text-5xl font-bold text-white font-serif">{average.toFixed(1)}</p>
          <div className="flex items-center justify-center gap-0.5 mt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className={`h-5 w-5 ${s <= Math.round(average) ? 'text-[#efc493] fill-[#efc493]' : 'text-[#aaa9a5]/30'}`} />
            ))}
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-2">{total} total reviews</p>
          <div className="mt-4 pt-4 border-t border-white/[.08]">
            <p className="text-2xl font-bold text-[#86d6c8]">{fiveStarPct.toFixed(0)}%</p>
            <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1">5-star rate</p>
          </div>
        </div>

        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h2 className="text-sm font-bold text-white font-serif tracking-tight mb-4">Rating Distribution</h2>
          <div className="space-y-2.5">
            {distribution.map(({ star, count, pct }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-sm text-[#aaa9a5] w-3 font-medium">{star}</span>
                <Star className={`h-3.5 w-3.5 ${count > 0 ? 'text-[#efc493]' : 'text-[#aaa9a5]/30'}`} />
                <div className="flex-1 h-2.5 bg-white/[.06] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#efc493] to-[#d4a56a] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-[#aaa9a5] w-8 text-right font-mono">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center">
            <ThumbsUp className="h-4 w-4 text-[#86d6c8]" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{distribution[0].count}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">5 Star</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#efc493]/10 flex items-center justify-center">
            <MessageSquare className="h-4 w-4 text-[#efc493]" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{reviews.filter((r) => r.comment).length}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">With comments</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-4 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#dce772]/10 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-[#dce772]" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">{average >= 4 ? 'Excellent' : average >= 3 ? 'Good' : 'Needs Work'}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Sentiment</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => setSortBy('newest')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] transition-all cursor-pointer ${sortBy === 'newest' ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white'}`}>Newest</button>
          <button onClick={() => setSortBy('highest')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] transition-all cursor-pointer ${sortBy === 'highest' ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white'}`}>Highest</button>
          <button onClick={() => setSortBy('lowest')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] transition-all cursor-pointer ${sortBy === 'lowest' ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white'}`}>Lowest</button>
        </div>
        <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5]">{sorted.length} reviews</span>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <Star className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">No reviews yet</p>
          <p className="text-[#aaa9a5] text-xs mt-1">Reviews will appear here once customers leave feedback</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((r) => (
            <div key={r.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">{r.booking.service.name}</span>
                  {r.comment && <Quote className="h-3 w-3 text-[#aaa9a5]/40" />}
                </div>
                <span className="text-[10px] text-[#aaa9a5]">{new Date(r.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-4 w-4 ${s <= r.rating ? 'text-[#efc493] fill-[#efc493]' : 'text-[#aaa9a5]/30'}`} />
                ))}
                <span className="text-xs text-[#aaa9a5] ml-2">{r.rating}/5</span>
              </div>
              {r.comment && (
                <p className="text-sm text-[#d4d4cf] leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ReviewsPage;
