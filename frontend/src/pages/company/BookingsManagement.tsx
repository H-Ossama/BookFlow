import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { bookingsApi } from '../../api/bookings.api';
import type { Booking, BookingStatus } from '../../types/booking.types';
import toast from 'react-hot-toast';
import { Check, X, Clock, Scissors, User, Search, Calendar, List, ChevronLeft, ChevronRight, Phone, Mail, DollarSign, CalendarDays, AlertCircle, Filter } from 'lucide-react';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  COMPLETED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REJECTED: 'text-gray-400 bg-gray-400/10',
};

const STATUS_BG: Record<BookingStatus, string> = {
  PENDING: 'bg-yellow-400/10 border-yellow-400/20',
  CONFIRMED: 'bg-blue-400/10 border-blue-400/20',
  COMPLETED: 'bg-green-400/10 border-green-400/20',
  CANCELLED: 'bg-red-400/10 border-red-400/20',
  REJECTED: 'bg-gray-400/10 border-gray-400/20',
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function BookingsManagement() {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [calDate, setCalDate] = useState(new Date());
  const [draggedBooking, setDraggedBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState('');

  const companyId = user?.companyId;

  const fetchBookings = useCallback(async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const result = await bookingsApi.getAll({
        companyId,
        status: statusFilter === 'ALL' ? undefined : statusFilter,
        page, limit: 50,
      });
      setBookings(result.bookings);
      setTotalPages(result.totalPages);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [companyId, statusFilter, page]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const filtered = bookings.filter((b) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.employee.user.firstName.toLowerCase().includes(q) ||
      b.employee.user.lastName.toLowerCase().includes(q) ||
      b.service.name.toLowerCase().includes(q) ||
      b.status.toLowerCase().includes(q)
    );
  });

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await bookingsApi.updateStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch { toast.error('Failed to update status'); }
    setShowDetail(false);
  };

  const handleDrop = async (targetDate: string) => {
    if (!draggedBooking) return;
    try {
      await bookingsApi.reschedule(draggedBooking.id, { date: targetDate, startTime: draggedBooking.startTime });
      toast.success('Booking rescheduled');
      fetchBookings();
    } catch (err: any) { toast.error(err?.response?.data?.message || 'Failed to reschedule'); }
    setDraggedBooking(null);
  };

  const statCount = (status: BookingStatus) => bookings.filter((b) => b.status === status).length;

  const year = calDate.getFullYear();
  const month = calDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const bookingsByDate: Record<string, Booking[]> = {};
  bookings.forEach((b) => {
    const key = b.date.split('T')[0];
    if (!bookingsByDate[key]) bookingsByDate[key] = [];
    bookingsByDate[key].push(b);
  });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const calCells: (number | null)[][] = [];
  let row: (number | null)[] = [];
  calendarDays.forEach((d, i) => {
    row.push(d);
    if (row.length === 7 || i === calendarDays.length - 1) { calCells.push(row); row = []; }
  });

  const formatDate = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const detailActions = () => {
    if (!selectedBooking) return null;
    const s = selectedBooking.status;
    return (
      <div className="flex gap-3 mt-6">
        {s === 'PENDING' && (
          <>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'CONFIRMED')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer"><Check className="h-4 w-4" /> Confirm</button>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'REJECTED')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500/20 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"><X className="h-4 w-4" /> Reject</button>
          </>
        )}
        {s === 'CONFIRMED' && (
          <>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'COMPLETED')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer"><Check className="h-4 w-4" /> Complete</button>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'CANCELLED')}
              className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-500/20 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/30 transition-all cursor-pointer"><X className="h-4 w-4" /> Cancel</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Bookings</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Manage all company appointments</p>
        </div>
        <div className="flex items-center gap-2 glass-card rounded-lg p-1">
          <button onClick={() => setView('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${view === 'list' ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white'}`}>
            <List className="h-4 w-4" /> List</button>
          <button onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${view === 'calendar' ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white'}`}>
            <Calendar className="h-4 w-4" /> Calendar</button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/[.08] pb-3 overflow-x-auto">
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const).map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
              statusFilter === s ? 'bg-[#86d6c8] text-[#050505]' : 'text-[#aaa9a5] hover:text-white hover:bg-white/[.06]'
            }`}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-3">
        {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const).map((s) => (
          <div key={s} className="glass-card rounded-xl p-4 text-center">
            <p className={`text-xl font-bold ${STATUS_COLORS[s].split(' ')[0]}`}>{statCount(s)}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-1">{s.charAt(0) + s.slice(1).toLowerCase()}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-lg">
        <Search className="h-4 w-4 text-[#aaa9a5]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by employee, service, or status..."
          className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
        </div>
      ) : view === 'list' && filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <CalendarDays className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">{search ? 'No bookings match your search' : 'No bookings yet'}</p>
          <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search term' : 'Bookings will appear here once customers start scheduling'}</p>
        </div>
      ) : view === 'list' && filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((b) => (
            <button key={b.id} onClick={() => { setSelectedBooking(b); setShowDetail(true); }}
              className="w-full text-left glass-card rounded-xl p-5 hover:border-white/[.14] transition-all cursor-pointer group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#86d6c8]/20 to-[#efc493]/20 flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {b.employee.user.firstName[0]}{b.employee.user.lastName[0]}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{b.employee.user.firstName} {b.employee.user.lastName}</p>
                    <div className="flex items-center gap-2 text-xs text-[#aaa9a5] mt-0.5 flex-wrap">
                      <span className="flex items-center gap-1"><Scissors className="h-3 w-3" /> {b.service.name}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {b.startTime} - {b.endTime}</span>
                      {b.notes && <span className="text-[#aaa9a5]/60">· &quot;{b.notes.slice(0, 40)}{b.notes.length > 40 ? '...' : ''}&quot;</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-[#aaa9a5] hidden sm:block">{b.date.split('T')[0]}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                </div>
              </div>
            </button>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${p === page ? 'bg-[#86d6c8] text-[#050505]' : 'bg-white/[.06] text-[#aaa9a5] hover:bg-white/[.1]'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {!loading && view === 'calendar' && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCalDate(new Date(year, month - 1, 1))} className="flex items-center gap-1 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h2 className="text-lg font-bold text-white font-serif tracking-tight">{MONTHS[month]} {year}</h2>
            <button onClick={() => setCalDate(new Date(year, month + 1, 1))} className="flex items-center gap-1 text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-white/[.08] rounded-xl overflow-hidden">
            {DAYS_SHORT.map((d) => (
              <div key={d} className="bg-[#0f0f0d] p-2 text-center text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5]">{d}</div>
            ))}
            {calCells.flat().map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="bg-[#0f0f0d] min-h-[110px] p-1" />;
              const dateStr = formatDate(d);
              const dayBookings = bookingsByDate[dateStr] || [];
              const today = new Date();
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div key={dateStr} onDragOver={(e) => e.preventDefault()} onDrop={() => handleDrop(dateStr)}
                  className={`bg-[#0f0f0d] min-h-[110px] p-1.5 border-t border-white/[.06] ${isToday ? 'ring-1 ring-[#86d6c8]/50' : ''} ${dayBookings.length > 0 ? 'cursor-pointer' : ''}`}>
                  <span className={`text-xs font-medium ${isToday ? 'text-[#86d6c8]' : 'text-[#aaa9a5]'}`}>{d}</span>
                  <div className="space-y-0.5 mt-1">
                    {dayBookings.slice(0, 3).map((b) => (
                      <div key={b.id} draggable onDragStart={() => setDraggedBooking(b)}
                        onClick={() => { setSelectedBooking(b); setShowDetail(true); }}
                        className={`text-[10px] px-1.5 py-0.5 rounded cursor-grab active:cursor-grabbing truncate border ${STATUS_BG[b.status]} ${STATUS_COLORS[b.status].split(' ')[0]} hover:opacity-80`}>
                        {b.startTime} {b.service.name}
                      </div>
                    ))}
                    {dayBookings.length > 3 && <p className="text-[10px] text-[#aaa9a5] px-1">+{dayBookings.length - 3} more</p>}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-[10px] text-[#aaa9a5] mt-3 text-center font-mono uppercase tracking-[.08em]">Drag a booking to a different day to reschedule</p>
        </div>
      )}

      {showDetail && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowDetail(false)}>
          <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">Booking Details</h2>
              <button onClick={() => setShowDetail(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[.03] border border-white/[.06]">
                <User className="h-5 w-5 text-[#86d6c8]" />
                <div>
                  <p className="text-white text-sm font-medium">{selectedBooking.employee.user.firstName} {selectedBooking.employee.user.lastName}</p>
                  <p className="text-[10px] text-[#aaa9a5]">{selectedBooking.employee.user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[.03] border border-white/[.06]">
                <Scissors className="h-5 w-5 text-[#86d6c8]" />
                <div>
                  <p className="text-white text-sm font-medium">{selectedBooking.service.name}</p>
                  <p className="text-[10px] text-[#aaa9a5]">{selectedBooking.service.duration} min &middot; ${selectedBooking.service.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[.03] border border-white/[.06]">
                <CalendarDays className="h-5 w-5 text-[#efc493]" />
                <div>
                  <p className="text-white text-sm font-medium">{selectedBooking.date.split('T')[0]}</p>
                  <p className="text-[10px] text-[#aaa9a5]">{selectedBooking.startTime} - {selectedBooking.endTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[.03] border border-white/[.06]">
                <DollarSign className="h-5 w-5 text-[#dce772]" />
                <div>
                  <p className="text-white text-sm font-medium">${selectedBooking.totalPrice.toFixed(2)}</p>
                  {selectedBooking.discountAmount > 0 && <p className="text-[10px] text-[#dce772]">Discount: -${selectedBooking.discountAmount.toFixed(2)}</p>}
                </div>
              </div>
              {selectedBooking.notes && (
                <div className="p-3 rounded-lg bg-white/[.03] border border-white/[.06]">
                  <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Notes</p>
                  <p className="text-white text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-[.08em] ${STATUS_COLORS[selectedBooking.status]}`}>{selectedBooking.status}</span>
                <span className="text-[10px] text-[#aaa9a5] ml-auto">ID: {selectedBooking.id.slice(0, 8)}...</span>
              </div>
            </div>
            {detailActions()}
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsManagement;
