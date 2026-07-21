import { useNotifications } from '../../hooks/useNotifications';
import { CheckCheck, Bell, ArrowLeft, ArrowRight, Loader2, Calendar, CalendarClock, CheckCircle2, XCircle, Ban, Star, RotateCcw, UserCheck, CreditCard, RefreshCw, MessageSquare } from 'lucide-react';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hours ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

const typeIconMap: Record<string, typeof Bell> = {
  booking_created: CalendarClock,
  booking_confirmed: CheckCircle2,
  booking_cancelled: XCircle,
  booking_rejected: Ban,
  booking_completed: Star,
  booking_rescheduled: RotateCcw,
  employee_booking: UserCheck,
  subscription_created: CreditCard,
  subscription_changed: RefreshCw,
  new_review: MessageSquare,
};

export function NotificationsPage() {
  const { notifications, unreadCount, loading, page, totalPages, markAsRead, markAllAsRead, goToPage } = useNotifications();

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Notifications</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all cursor-pointer"
            >
              <CheckCheck className="h-4 w-4" /> Mark All Read
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-[#86d6c8]" />
        </div>
      ) : notifications.length === 0 ? (
        <div className="glass-card rounded-xl p-16 text-center">
          <Bell className="h-12 w-12 text-[#aaa9a5] mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white font-serif tracking-tight mb-2">No notifications yet</h2>
          <p className="text-[#aaa9a5] text-sm">You'll see notifications here when bookings are made or other activity happens.</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => { if (!n.isRead) markAsRead(n.id); }}
                className={`glass-card rounded-xl px-5 py-4 transition-all cursor-pointer ${
                  n.isRead ? 'opacity-60' : 'border-l-[3px] border-l-[#86d6c8]'
                } hover:bg-white/[.04]`}
              >
                <div className="flex items-start gap-4">
                  <span className="w-9 h-9 rounded-xl bg-white/[.06] flex items-center justify-center shrink-0 mt-0.5">
                    {(() => { const Icon = typeIconMap[n.type]; return Icon ? <Icon className="h-4 w-4 text-[#86d6c8]" /> : <Bell className="h-4 w-4 text-[#aaa9a5]" />; })()}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`text-sm font-medium ${n.isRead ? 'text-[#aaa9a5]' : 'text-white'}`}>
                        {n.title}
                      </h3>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#86d6c8] shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-[#aaa9a5] leading-relaxed">{n.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="flex items-center gap-1 text-[10px] font-mono text-[#6b6b68]">
                        <Calendar className="h-3 w-3" /> {timeAgo(n.createdAt)}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[.08em] text-[#6b6b68]">
                        {n.type.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" /> Previous
              </button>
              <span className="text-xs text-[#aaa9a5] font-mono">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
              >
                Next <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}