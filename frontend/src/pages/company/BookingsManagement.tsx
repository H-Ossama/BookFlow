import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { bookingsApi } from '../../api/bookings.api';
import type { Booking, BookingStatus } from '../../types/booking.types';
import toast from 'react-hot-toast';
import { Check, X, Clock, Scissors, User, ChevronDown, Calendar, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatsSkeleton, TableSkeleton } from '../../components/common';

const STATUS_COLORS: Record<BookingStatus, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  COMPLETED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REJECTED: 'text-gray-400 bg-gray-400/10',
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

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

  const handleStatusChange = async (id: string, status: BookingStatus) => {
    try {
      await bookingsApi.updateStatus(id, status);
      toast.success(`Booking ${status.toLowerCase()}`);
      fetchBookings();
    } catch {
      toast.error('Failed to update status');
    }
    setShowDetail(false);
  };

  const handleDrop = async (targetDate: string) => {
    if (!draggedBooking) return;
    try {
      await bookingsApi.reschedule(draggedBooking.id, { date: targetDate, startTime: draggedBooking.startTime });
      toast.success('Booking rescheduled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to reschedule');
    }
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
    if (row.length === 7 || i === calendarDays.length - 1) {
      calCells.push(row);
      row = [];
    }
  });

  const formatDate = (d: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

  const detailActions = () => {
    if (!selectedBooking) return null;
    const s = selectedBooking.status;
    return (
      <div className="flex gap-3 mt-6">
        {s === 'PENDING' && (
          <>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'CONFIRMED')} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-500 transition-all cursor-pointer"><Check className="h-4 w-4" /> Confirm</button>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'REJECTED')} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600/80 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-all cursor-pointer"><X className="h-4 w-4" /> Reject</button>
          </>
        )}
        {s === 'CONFIRMED' && (
          <>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'COMPLETED')} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white hover:bg-green-500 transition-all cursor-pointer"><Check className="h-4 w-4" /> Complete</button>
            <button onClick={() => handleStatusChange(selectedBooking.id, 'CANCELLED')} className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-red-600/80 py-2.5 text-sm font-semibold text-white hover:bg-red-500 transition-all cursor-pointer"><X className="h-4 w-4" /> Cancel</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Bookings</h1>
          <p className="text-gray-400 mt-1">Manage all company appointments</p>
        </div>
        <div className="flex items-center gap-2 bg-[#121620] border border-white/5 rounded-lg p-1">
          <button onClick={() => setView('list')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${view === 'list' ? 'bg-[#c5a880] text-[#0a0c10]' : 'text-gray-400 hover:text-white'}`}><List className="h-4 w-4" /> List</button>
          <button onClick={() => setView('calendar')} className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-all cursor-pointer ${view === 'calendar' ? 'bg-[#c5a880] text-[#0a0c10]' : 'text-gray-400 hover:text-white'}`}><Calendar className="h-4 w-4" /> Calendar</button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-white/5 pb-3 overflow-x-auto">
        {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const).map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${statusFilter === s ? 'bg-[#c5a880] text-[#0a0c10]' : 'text-gray-400 hover:text-white'}`}>
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4">
        {(['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'REJECTED'] as const).map((s) => (
          <div key={s} className="bg-[#121620] border border-white/5 rounded-xl p-4 text-center">
            <p className={`text-lg font-bold ${STATUS_COLORS[s].split(' ')[0]}`}>{statCount(s)}</p>
            <p className="text-xs text-gray-500 mt-1">{s.charAt(0) + s.slice(1).toLowerCase()}</p>
          </div>
        ))}
      </div>

      {loading && (view === 'list' ? <TableSkeleton /> : <StatsSkeleton />)}

      {!loading && view === 'list' && bookings.length === 0 && (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No bookings found</p>
        </div>
      )}

      {!loading && view === 'list' && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <button key={b.id} onClick={() => { setSelectedBooking(b); setShowDetail(true); }}
              className="w-full text-left bg-[#121620] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium">
                    {b.customerId.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{b.employee.user.firstName} {b.employee.user.lastName}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-0.5">
                      <Scissors className="h-3 w-3" /> {b.service.name}
                      <Clock className="h-3 w-3 ml-1" /> {b.startTime} - {b.endTime}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500">{b.date.split('T')[0]}</span>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </div>
            </button>
          ))}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all cursor-pointer ${p === page ? 'bg-[#c5a880] text-[#0a0c10]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{p}</button>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && view === 'calendar' && (
        <div className="bg-[#121620] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setCalDate(new Date(year, month - 1, 1))} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"><ChevronLeft className="h-5 w-5" /></button>
            <h2 className="text-lg font-bold text-white">{MONTHS[month]} {year}</h2>
            <button onClick={() => setCalDate(new Date(year, month + 1, 1))} className="flex items-center gap-1 text-gray-400 hover:text-white transition-colors cursor-pointer"><ChevronRight className="h-5 w-5" /></button>
          </div>
          <div className="grid grid-cols-7 gap-px bg-white/5 rounded-xl overflow-hidden">
            {DAYS.map((d) => (
              <div key={d} className="bg-[#0a0c10] p-2 text-center text-xs font-medium text-gray-500 uppercase">{d}</div>
            ))}
            {calCells.flat().map((d, i) => {
              if (d === null) return <div key={`e${i}`} className="bg-[#0a0c10] min-h-[100px] p-1" />;
              const dateStr = formatDate(d);
              const dayBookings = bookingsByDate[dateStr] || [];
              const today = new Date();
              const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(dateStr)}
                  className={`bg-[#0a0c10] min-h-[100px] p-1 border-t border-white/5 ${isToday ? 'ring-1 ring-[#c5a880]/40' : ''}`}
                >
                  <span className={`text-xs font-medium ${isToday ? 'text-[#c5a880]' : 'text-gray-500'}`}>{d}</span>
                  <div className="space-y-0.5 mt-1">
                    {dayBookings.slice(0, 3).map((b) => (
                      <div
                        key={b.id}
                        draggable
                        onDragStart={() => setDraggedBooking(b)}
                        onClick={() => { setSelectedBooking(b); setShowDetail(true); }}
                        className={`text-[10px] px-1 py-0.5 rounded cursor-grab active:cursor-grabbing truncate ${STATUS_COLORS[b.status]} hover:opacity-80`}
                      >
                        {b.startTime} {b.service.name}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <p className="text-[10px] text-gray-500 px-1">+{dayBookings.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">Drag a booking to a different day to reschedule</p>
        </div>
      )}

      {showDetail && selectedBooking && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Booking Details</h2>
              <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <User className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm">Customer ID: <span className="text-gray-400">{selectedBooking.customerId.slice(0, 8)}...</span></p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <User className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedBooking.employee.user.firstName} {selectedBooking.employee.user.lastName}</p><p className="text-xs text-gray-400">{selectedBooking.employee.user.email}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <Scissors className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedBooking.service.name}</p><p className="text-xs text-gray-400">{selectedBooking.service.duration} min &middot; ${selectedBooking.service.price}</p></div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[#1a202c]/30">
                <Clock className="h-5 w-5 text-[#c5a880]" />
                <div><p className="text-white text-sm font-medium">{selectedBooking.date.split('T')[0]} at {selectedBooking.startTime} - {selectedBooking.endTime}</p></div>
              </div>
              <div className="p-3 rounded-lg bg-[#1a202c]/30">
                <p className="text-xs text-gray-400 mb-1">Total: <span className="text-white font-semibold">${selectedBooking.totalPrice.toFixed(2)}</span></p>
                {selectedBooking.discountAmount > 0 && <p className="text-xs text-green-400">Discount: -${selectedBooking.discountAmount.toFixed(2)}</p>}
              </div>
              {selectedBooking.notes && (
                <div className="p-3 rounded-lg bg-[#1a202c]/30">
                  <p className="text-xs text-gray-400 mb-1">Notes:</p>
                  <p className="text-white text-sm">{selectedBooking.notes}</p>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${STATUS_COLORS[selectedBooking.status]}`}>{selectedBooking.status}</span>
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
