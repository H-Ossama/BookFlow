import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ExternalLink, X, Loader2, CalendarClock, CheckCircle2, XCircle, Ban, Star, RotateCcw, UserCheck, CreditCard, RefreshCw, MessageSquare } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import { useAuthContext } from '../../context/AuthContext';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

export function NotificationBell() {
  const { isAuthenticated, user } = useAuthContext();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (!isAuthenticated || !user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors cursor-pointer"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-[#ef6d67] text-white text-[9px] font-bold leading-none px-1">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[90vw] glass-card rounded-xl overflow-hidden shadow-2xl z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[.08]">
            <h3 className="text-sm font-bold text-white font-serif tracking-tight">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={() => { markAllAsRead(); }}
                  className="flex items-center gap-1 text-[9px] font-mono uppercase tracking-[.08em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors cursor-pointer"
                >
                  <CheckCheck className="h-2.5 w-2.5" /> Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-5 w-5 animate-spin text-[#86d6c8]" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <Bell className="h-8 w-8 text-[#aaa9a5] mb-2" />
                <p className="text-[#aaa9a5] text-xs">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[.06]">
                {notifications.slice(0, 10).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => { if (!n.isRead) markAsRead(n.id); }}
                    className={`w-full text-left px-4 py-3 transition-colors cursor-pointer ${
                      n.isRead ? 'opacity-60' : 'bg-[#86d6c8]/[0.04]'
                    } hover:bg-white/[.04]`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-lg bg-white/[.06] flex items-center justify-center shrink-0 mt-0.5">
                        {(() => { const Icon = typeIconMap[n.type]; return Icon ? <Icon className="h-3.5 w-3.5 text-[#86d6c8]" /> : <Bell className="h-3.5 w-3.5 text-[#aaa9a5]" />; })()}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs ${n.isRead ? 'text-[#aaa9a5]' : 'text-white'} font-medium truncate`}>
                          {n.title}
                        </p>
                        <p className="text-[11px] text-[#aaa9a5] mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                        <p className="text-[9px] font-mono text-[#6b6b68] mt-1">{timeAgo(n.createdAt)}</p>
                      </div>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#86d6c8] shrink-0 mt-1.5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/dashboard/notifications"
            onClick={() => setOpen(false)}
            className="flex items-center justify-center gap-2 px-4 py-3 border-t border-white/[.08] text-[11px] font-mono uppercase tracking-[.08em] text-[#86d6c8] hover:text-[#9ee0d4] hover:bg-white/[.03] transition-colors no-underline"
          >
            <ExternalLink className="h-3 w-3" /> View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}