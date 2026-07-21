import { useState, useEffect } from 'react';
import { adminApi, type PlatformStatsData } from '../../api/admin.api';
import {
  BarChart3, Users, Star, Tag, Award, Activity,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#efc493',
  CONFIRMED: '#7eb8da',
  COMPLETED: '#86d6c8',
  CANCELLED: '#e8a0b4',
  REJECTED: '#6b7280',
};
const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: '#e8a0b4',
  COMPANY_ADMIN: '#86d6c8',
  EMPLOYEE: '#efc493',
  CUSTOMER: '#7eb8da',
};

export function PlatformStats() {
  const [data, setData] = useState<PlatformStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminApi.getPlatformStats();
        setData(result);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return <div className="text-center py-16 text-[#aaa9a5]">Failed to load platform stats</div>;
  }

  const statusData = Object.entries(data.bookingStatusDistribution)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: STATUS_COLORS[name] || '#aaa9a5' }));

  const roleData = Object.entries(data.roleDistribution)
    .filter(([, v]) => v > 0)
    .map(([name, value]) => ({ name, value, color: ROLE_COLORS[name] || '#aaa9a5' }));

  const totalBookings = Object.values(data.bookingStatusDistribution).reduce((a, b) => a + b, 0);
  const completedBookings = data.bookingStatusDistribution.COMPLETED || 0;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Platform Analytics</h1>
        <p className="text-[#aaa9a5] text-xs mt-1">Detailed metrics and insights across all businesses</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Users className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalUsers}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">platform-wide</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dce772]/10 flex items-center justify-center"><Activity className="h-4 w-4 text-[#dce772]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#dce772] font-semibold">Bookings</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalBookings}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{completedBookings} completed</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#efc493]/10 flex items-center justify-center"><Star className="h-4 w-4 text-[#efc493]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#efc493] font-semibold">Reviews</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalReviews}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{data.averageRating.toFixed(1)} avg rating</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8a0b4]/10 flex items-center justify-center"><Tag className="h-4 w-4 text-[#e8a0b4]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#e8a0b4] font-semibold">Coupons</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalCoupons}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{data.activeCoupons} active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Booking Status Distribution</h2>
            <BarChart3 className="h-4 w-4 text-[#86d6c8]" />
          </div>
          {statusData.length === 0 ? (
            <p className="text-[#aaa9a5] text-center py-8 text-sm">No booking data yet</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData} layout="vertical">
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} width={90} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">User Role Distribution</h2>
            <Users className="h-4 w-4 text-[#efc493]" />
          </div>
          {roleData.length === 0 ? (
            <p className="text-[#aaa9a5] text-center py-8 text-sm">No user data yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55}>
                    {roleData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Legend formatter={(value, entry: any) => <span style={{ color: '#fff', fontSize: 11 }}>{value} — {entry.payload?.value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-white font-serif tracking-tight">Top Companies by Bookings</h2>
          <Award className="h-4 w-4 text-[#dce772]" />
        </div>
        {data.topCompanies.length === 0 ? (
          <p className="text-[#aaa9a5] text-center py-8 text-sm">No company data yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-white/[.08]">
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">#</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Company</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Plan</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Status</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Bookings</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Reviews</th>
                </tr>
              </thead>
              <tbody>
                {data.topCompanies.map((c, i) => (
                  <tr key={c.id} className="border-b border-white/[.06] last:border-0">
                    <td className="py-3 text-[#aaa9a5] text-xs font-mono">{String(i + 1).padStart(2, '0')}</td>
                    <td className="py-3 text-white text-xs font-medium">{c.name}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                        c.subscriptionPlan === 'PREMIUM' ? 'text-[#86d6c8] bg-[#86d6c8]/10' :
                        c.subscriptionPlan === 'BASIC' ? 'text-[#efc493] bg-[#efc493]/10' :
                        'text-[#7eb8da] bg-[#7eb8da]/10'
                      }`}>{c.subscriptionPlan}</span>
                    </td>
                    <td className="py-3">
                      <span className={`flex items-center gap-1 text-[10px] font-semibold ${c.isActive ? 'text-green-400' : 'text-red-400'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                        {c.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-white text-xs font-medium">{c.bookingCount}</td>
                    <td className="py-3 text-[#aaa9a5] text-xs">{c.reviewCount}</td>
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

export default PlatformStats;
