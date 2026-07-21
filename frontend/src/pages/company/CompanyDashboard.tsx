import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { analyticsApi, type DashboardStats } from '../../api/analytics.api';
import { bookingsApi } from '../../api/bookings.api';
import { servicesApi } from '../../api/services.api';
import { employeesApi } from '../../api/employees.api';
import { reviewsApi } from '../../api/reviews.api';
import {
  Calendar, DollarSign, TrendingUp, XCircle, Users, Scissors, Star, Clock,
  Plus, ArrowUpRight, BarChart3, CheckCircle2, Activity, AlertCircle,
  Zap, Percent
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import type { Booking } from '../../types/booking.types';

const CHART_COLORS = ['#86d6c8', '#efc493', '#dce772', '#e8a0b4', '#7eb8da', '#c5a880'];
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  CONFIRMED: 'text-blue-400 bg-blue-400/10',
  COMPLETED: 'text-green-400 bg-green-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
  REJECTED: 'text-gray-400 bg-gray-400/10',
};

function usePermissions() {
  const { user } = useAuthContext();
  return useMemo(() => {
    const perms: string[] = [];
    if (!user) return { isAdmin: false, has: () => false };
    if (user.role === 'SUPER_ADMIN' || user.role === 'COMPANY_ADMIN') return { isAdmin: true, has: () => true };
    if (user.role === 'CUSTOMER') return { isAdmin: false, has: (p: string) => ['my-bookings', 'settings', 'notifications'].includes(p) };
    return { isAdmin: false, has: (p: string) => (user.companyRole?.permissions || []).includes(p) };
  }, [user]);
}

export function CompanyDashboard() {
  const { user } = useAuthContext();
  const perm = usePermissions();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [todayBookings, setTodayBookings] = useState<Booking[]>([]);
  const [serviceCount, setServiceCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [avgRating, setAvgRating] = useState<number | null>(null);
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const companyId = user?.companyId;

  const fetchData = async () => {
    if (!companyId) return;
    setLoading(true);
    try {
      const [stats, bookingsResult, servicesResult, employeesResult, reviewsResult] = await Promise.all([
        analyticsApi.getDashboard(companyId, dateFrom || undefined, dateTo || undefined),
        bookingsApi.getAll({ companyId, limit: 10, dateFrom: new Date().toISOString().split('T')[0], dateTo: new Date().toISOString().split('T')[0] }),
        servicesApi.getAll(companyId).catch(() => ({ services: [], total: 0 })),
        employeesApi.getAll(companyId).catch(() => []),
        reviewsApi.getAll(companyId).catch(() => ({ reviews: [], average: 0, total: 0 })),
      ]);
      setData(stats);
      setTodayBookings(bookingsResult.bookings || []);
      setServiceCount(servicesResult.total || (Array.isArray(servicesResult) ? 0 : servicesResult.services?.length || 0));
      setEmployeeCount(employeesResult.length || 0);
      setAvgRating(reviewsResult.average || null);

      const allBookings = await bookingsApi.getAll({ companyId, limit: 200 }).catch(() => ({ bookings: [] }));
      const counts: Record<string, number> = {};
      (allBookings.bookings || []).forEach((b: Booking) => { counts[b.status] = (counts[b.status] || 0) + 1; });
      setStatusCounts(counts);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [companyId]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-[#aaa9a5]">Failed to load dashboard data</div>;
  }

  const totalBookings = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const pendingCount = statusCounts['PENDING'] || 0;
  const confirmedCount = statusCounts['CONFIRMED'] || 0;
  const completedCount = statusCounts['COMPLETED'] || 0;
  const cancelledCount = statusCounts['CANCELLED'] || 0;
  const completionRate = totalBookings > 0 ? Math.round((completedCount / totalBookings) * 100) : 0;

  const statusData = [
    { name: 'Completed', count: completedCount, color: '#86d6c8' },
    { name: 'Confirmed', count: confirmedCount, color: '#7eb8da' },
    { name: 'Pending', count: pendingCount, color: '#efc493' },
    { name: 'Cancelled', count: cancelledCount, color: '#e8a0b4' },
  ];

  const revenueData = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (11 - i));
    return { month: d.toLocaleString('default', { month: 'short' }), revenue: 0, bookings: 0 };
  });

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#aaa9a5] text-sm">{greeting()}, <span className="text-white font-medium">{user?.firstName}</span></p>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight mt-0.5">{user?.company?.name || 'Dashboard'}</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          {perm.has('bookings') && (
            <Link to="/dashboard/bookings" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all">
              <Plus className="h-4 w-4" /> New Booking
            </Link>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-lg glass-card border border-white/[.08] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
        <span className="text-[#aaa9a5] text-xs">to</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="rounded-lg glass-card border border-white/[.08] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
        <button onClick={fetchData}
          className="rounded-lg bg-[#86d6c8] py-2 px-4 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">Apply</button>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }}
            className="text-xs text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">Reset</button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        {perm.has('bookings') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Calendar className="h-4 w-4 text-[#86d6c8]" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Today</span>
            </div>
            <p className="text-2xl font-bold text-white">{data.todayBookings}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">bookings today</p>
          </div>
        )}
        {perm.has('reports') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#dce772]/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-[#dce772]" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#dce772] font-semibold">Revenue</span>
            </div>
            <p className="text-2xl font-bold text-white">${data.periodRevenue.toFixed(2)}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{data.periodBookingsCount} bookings</p>
          </div>
        )}
        {perm.has('reviews') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#efc493]/10 flex items-center justify-center"><Star className="h-4 w-4 text-[#efc493]" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#efc493] font-semibold">Rating</span>
            </div>
            <p className="text-2xl font-bold text-white">{avgRating ? avgRating.toFixed(1) : '—'}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">avg rating</p>
          </div>
        )}
        {perm.has('employees') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#7eb8da]/10 flex items-center justify-center"><Users className="h-4 w-4 text-[#7eb8da]" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#7eb8da] font-semibold">Team</span>
            </div>
            <p className="text-2xl font-bold text-white">{employeeCount}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">active employees</p>
          </div>
        )}
        {perm.has('services') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#e8a0b4]/10 flex items-center justify-center"><Scissors className="h-4 w-4 text-[#e8a0b4]" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#e8a0b4] font-semibold">Services</span>
            </div>
            <p className="text-2xl font-bold text-white">{serviceCount}</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">offered services</p>
          </div>
        )}
        {perm.has('bookings') && (
          <div className="flex-1 min-w-[140px] glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"><XCircle className="h-4 w-4 text-red-400" /></div>
              <span className="text-[10px] font-mono uppercase tracking-[.13em] text-red-400 font-semibold">Cancelled</span>
            </div>
            <p className="text-2xl font-bold text-white">{data.cancellationRate}%</p>
            <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">cancellation rate</p>
          </div>
        )}
      </div>

      {perm.has('bookings') && (
        <div>
          <h2 className="text-sm font-bold text-white font-serif tracking-tight mb-4">Booking Status</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-3">
            {statusData.map((s) => (
              <div key={s.name} className="glass-card rounded-xl p-4 flex items-center gap-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                <div>
                  <p className="text-lg font-bold text-white">{s.count}</p>
                  <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">{s.name}</p>
                </div>
              </div>
            ))}
            <div className="glass-card rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Percent className="h-4 w-4 text-[#86d6c8]" /></div>
              <div>
                <p className="text-lg font-bold text-white">{completionRate}%</p>
                <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Completion</p>
              </div>
            </div>
          </div>
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-serif tracking-tight">Today's Schedule</h2>
              <Link to="/dashboard/bookings" className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors flex items-center gap-1">
                View all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {todayBookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Calendar className="h-8 w-8 text-[#aaa9a5] mb-2" />
                <p className="text-[#aaa9a5] text-xs">No bookings today</p>
              </div>
            ) : (
              <div className="space-y-2">
                {todayBookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/[.03] border border-white/[.06]">
                    <div className="w-8 h-8 rounded-full bg-[#86d6c8]/20 flex items-center justify-center text-[10px] font-semibold text-[#86d6c8] shrink-0">
                      {b.employee.user.firstName[0]}{b.employee.user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-medium truncate">{b.service.name}</p>
                      <p className="text-[10px] text-[#aaa9a5]">{b.startTime} - {b.endTime}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {perm.has('reports') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-serif tracking-tight">Revenue Overview</h2>
              <TrendingUp className="h-4 w-4 text-[#86d6c8]" />
            </div>
            {data.popularServices.length === 0 ? (
              <p className="text-[#aaa9a5] text-center py-8 text-sm">No revenue data yet</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#86d6c8" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#86d6c8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Area type="monotone" dataKey="revenue" stroke="#86d6c8" strokeWidth={2} fill="url(#revenueGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-serif tracking-tight">Booking Volume</h2>
              <BarChart3 className="h-4 w-4 text-[#efc493]" />
            </div>
            {data.popularServices.length === 0 ? (
              <p className="text-[#aaa9a5] text-center py-8 text-sm">No booking data yet</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="bookingGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#efc493" stopOpacity={0.3} />
                        <stop offset="100%" stopColor="#efc493" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff', fontSize: 12 }} />
                    <Area type="monotone" dataKey="bookings" stroke="#efc493" strokeWidth={2} fill="url(#bookingGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-6">
        {perm.has('services') && (
          <div className="flex-1 min-w-[320px] glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-serif tracking-tight">Popular Services</h2>
              <Link to="/dashboard/services" className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors">Manage</Link>
            </div>
            {data.popularServices.length === 0 ? (
              <p className="text-[#aaa9a5] text-center py-8 text-sm">No bookings yet</p>
            ) : (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.popularServices} layout="vertical">
                    <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={100} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }} />
                    <Bar dataKey="bookingCount" fill="#86d6c8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
        {perm.has('employees') && (
          <div className="flex-1 min-w-[320px] glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white font-serif tracking-tight">Top Employees</h2>
              <Link to="/dashboard/employees" className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors">Manage</Link>
            </div>
            {data.topEmployees.length === 0 ? (
              <p className="text-[#aaa9a5] text-center py-8 text-sm">No bookings yet</p>
            ) : (
              <div className="flex items-center gap-6">
                <div className="h-56 w-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.topEmployees} dataKey="bookingCount" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={30}
                        label={({ name, percent }: PieLabelRenderProps) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                        {data.topEmployees.map((_, i) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {data.topEmployees.slice(0, 4).map((e, i) => (
                    <div key={e.id} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#aaa9a5] font-mono w-3">{i + 1}</span>
                        <span className="text-white">{e.name}</span>
                      </div>
                      <span className="text-[#aaa9a5]">{e.bookingCount} bookings</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {perm.has('services') && (
          <Link to="/dashboard/services"
            className="flex-1 min-w-[220px] glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#86d6c8]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#86d6c8]/10 flex items-center justify-center group-hover:bg-[#86d6c8]/20 transition-all">
              <Plus className="h-5 w-5 text-[#86d6c8]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Add a Service</p>
              <p className="text-[#aaa9a5] text-xs mt-0.5">Create a new service offering</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#86d6c8] transition-all" />
          </Link>
        )}
        {perm.has('employees') && (
          <Link to="/dashboard/employees"
            className="flex-1 min-w-[220px] glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#efc493]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#efc493]/10 flex items-center justify-center group-hover:bg-[#efc493]/20 transition-all">
              <Users className="h-5 w-5 text-[#efc493]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Manage Team</p>
              <p className="text-[#aaa9a5] text-xs mt-0.5">Add or update employees</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#efc493] transition-all" />
          </Link>
        )}
        {perm.has('reports') && (
          <Link to="/dashboard/reports"
            className="flex-1 min-w-[220px] glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#dce772]/40 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-[#dce772]/10 flex items-center justify-center group-hover:bg-[#dce772]/20 transition-all">
              <BarChart3 className="h-5 w-5 text-[#dce772]" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">View Reports</p>
              <p className="text-[#aaa9a5] text-xs mt-0.5">Export data and insights</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#dce772] transition-all" />
          </Link>
        )}
      </div>

      {perm.has('bookings') && (
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Recent Bookings</h2>
            <Link to="/dashboard/bookings" className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Calendar className="h-10 w-10 text-[#aaa9a5] mb-3" />
              <p className="text-white text-sm font-medium">No bookings yet</p>
              <p className="text-[#aaa9a5] text-xs mt-1">Bookings will appear here once customers start scheduling</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-white/[.08]">
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Service</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Employee</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Date</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Amount</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentBookings.map((b) => (
                    <tr key={b.id} className="border-b border-white/[.06] last:border-0">
                      <td className="py-3.5 text-white text-xs font-medium">{b.service.name}</td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{b.employee.user.firstName} {b.employee.user.lastName}</td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{b.startTime} - {b.endTime}</td>
                      <td className="py-3.5 text-white text-xs font-medium">${b.totalPrice.toFixed(2)}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
