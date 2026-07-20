import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { analyticsApi, type DashboardStats } from '../../api/analytics.api';
import { Calendar, DollarSign, TrendingUp, XCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';

const COLORS = ['#c5a880', '#e8cfa6', '#a88b6a', '#8a7254', '#6b5a3f'];

export function CompanyDashboard() {
  const { user } = useAuthContext();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const companyId = user?.companyId;

  const fetchData = () => {
    if (!companyId) return;
    setLoading(true);
    analyticsApi.getDashboard(companyId, dateFrom || undefined, dateTo || undefined).then(setData).catch(() => {}).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, [companyId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-gray-500">Failed to load dashboard data</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Overview of your business</p>
      </div>

      {/* Date Range Filter */}
      <div className="flex items-center gap-3">
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="rounded-lg border border-white/5 bg-[#1a202c]/50 py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
        <span className="text-gray-500">to</span>
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="rounded-lg border border-white/5 bg-[#1a202c]/50 py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
        <button onClick={fetchData} className="rounded-lg bg-[#c5a880] py-2 px-4 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all cursor-pointer">Apply</button>
        {(dateFrom || dateTo) && (
          <button onClick={() => { setDateFrom(''); setDateTo(''); }} className="text-sm text-gray-400 hover:text-white transition-colors cursor-pointer">Reset</button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#121620] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"><Calendar className="h-5 w-5 text-blue-400" /></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Today</span>
          </div>
          <p className="text-3xl font-bold text-white">{data.todayBookings}</p>
          <p className="text-sm text-gray-400 mt-1">bookings today</p>
        </div>
        <div className="bg-[#121620] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><DollarSign className="h-5 w-5 text-green-400" /></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Revenue</span>
          </div>
          <p className="text-3xl font-bold text-white">${data.periodRevenue.toFixed(2)}</p>
          <p className="text-sm text-gray-400 mt-1">{data.periodBookingsCount} bookings this period</p>
        </div>
        <div className="bg-[#121620] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 flex items-center justify-center"><TrendingUp className="h-5 w-5 text-[#c5a880]" /></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Top Employee</span>
          </div>
          <p className="text-3xl font-bold text-white">{data.topEmployees[0]?.name || 'N/A'}</p>
          <p className="text-sm text-gray-400 mt-1">{data.topEmployees[0]?.bookingCount || 0} bookings</p>
        </div>
        <div className="bg-[#121620] border border-white/5 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center"><XCircle className="h-5 w-5 text-red-400" /></div>
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Cancellation</span>
          </div>
          <p className="text-3xl font-bold text-white">{data.cancellationRate}%</p>
          <p className="text-sm text-gray-400 mt-1">cancellation rate</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Popular Services Chart */}
        <div className="bg-[#121620] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Popular Services</h2>
          {data.popularServices.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.popularServices} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} width={90} />
                  <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff' }} />
                  <Bar dataKey="bookingCount" fill="#c5a880" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Top Employees Chart */}
        <div className="bg-[#121620] border border-white/5 rounded-xl p-6">
          <h2 className="text-lg font-bold text-white mb-4">Top Employees</h2>
          {data.topEmployees.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No bookings yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.topEmployees} dataKey="bookingCount" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }: PieLabelRenderProps) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}>
                    {data.topEmployees.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a202c', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-[#121620] border border-white/5 rounded-xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">Recent Bookings</h2>
        {data.recentBookings.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No bookings yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-white/5">
                  <th className="pb-3 font-semibold">Service</th>
                  <th className="pb-3 font-semibold">Employee</th>
                  <th className="pb-3 font-semibold">Time</th>
                  <th className="pb-3 font-semibold">Amount</th>
                  <th className="pb-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recentBookings.map((b) => (
                  <tr key={b.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 text-white">{b.service.name}</td>
                    <td className="py-3 text-gray-300">{b.employee.user.firstName} {b.employee.user.lastName}</td>
                    <td className="py-3 text-gray-400">{b.startTime} - {b.endTime}</td>
                    <td className="py-3 text-white">${b.totalPrice.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        b.status === 'COMPLETED' ? 'text-green-400 bg-green-400/10' :
                        b.status === 'CONFIRMED' ? 'text-blue-400 bg-blue-400/10' :
                        b.status === 'PENDING' ? 'text-yellow-400 bg-yellow-400/10' :
                        b.status === 'CANCELLED' ? 'text-red-400 bg-red-400/10' :
                        'text-gray-400 bg-gray-400/10'
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default CompanyDashboard;
