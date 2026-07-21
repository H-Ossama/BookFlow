import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { adminApi, type AdminDashboardData } from '../../api/admin.api';
import {
  Building2, Users, Calendar, DollarSign, TrendingUp, Activity,
  ArrowUpRight, AlertCircle, Zap, BarChart3
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';

const PLAN_COLORS: Record<string, string> = {
  FREE: '#7eb8da',
  BASIC: '#efc493',
  PREMIUM: '#86d6c8',
};

export function AdminDashboard() {
  const { user } = useAuthContext();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await adminApi.getDashboard();
        setData(result);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const planData = Object.entries(data.subscriptionDistribution).map(([name, value]) => ({
    name, value, color: PLAN_COLORS[name] || '#aaa9a5',
  }));

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[#aaa9a5] text-sm">{greeting()}, <span className="text-white font-medium">{user?.firstName}</span></p>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight mt-0.5">Platform Overview</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/admin/companies" className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all">
            <Building2 className="h-4 w-4" /> All Businesses
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Building2 className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Companies</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalCompanies}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{data.activeCompanies} active</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7eb8da]/10 flex items-center justify-center"><Users className="h-4 w-4 text-[#7eb8da]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#7eb8da] font-semibold">Users</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalUsers}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">platform users</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dce772]/10 flex items-center justify-center"><Calendar className="h-4 w-4 text-[#dce772]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#dce772] font-semibold">Bookings</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.totalBookings}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{data.periodBookings} this month</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#e8a0b4]/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-[#e8a0b4]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#e8a0b4] font-semibold">Revenue</span>
          </div>
          <p className="text-2xl font-bold text-white">${data.totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">${data.periodRevenue.toFixed(2)} this month</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#efc493]/10 flex items-center justify-center"><Activity className="h-4 w-4 text-[#efc493]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#efc493] font-semibold">Today</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.todayBookings}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">bookings today</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center"><AlertCircle className="h-4 w-4 text-red-400" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-red-400 font-semibold">Pending</span>
          </div>
          <p className="text-2xl font-bold text-white">{data.pendingCompanies}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">inactive companies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Monthly Revenue Trend</h2>
            <TrendingUp className="h-4 w-4 text-[#86d6c8]" />
          </div>
          {data.monthlyTrend.length === 0 ? (
            <p className="text-[#aaa9a5] text-center py-8 text-sm">No revenue data yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.monthlyTrend}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#86d6c8" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#86d6c8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Area type="monotone" dataKey="revenue" stroke="#86d6c8" strokeWidth={2} fill="url(#revGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Monthly Bookings Trend</h2>
            <BarChart3 className="h-4 w-4 text-[#efc493]" />
          </div>
          {data.monthlyTrend.length === 0 ? (
            <p className="text-[#aaa9a5] text-center py-8 text-sm">No booking data yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyTrend}>
                  <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="bookings" fill="#efc493" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Subscription Distribution</h2>
            <Zap className="h-4 w-4 text-[#dce772]" />
          </div>
          {planData.every((p) => p.value === 0) ? (
            <p className="text-[#aaa9a5] text-center py-8 text-sm">No companies yet</p>
          ) : (
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={planData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={55}>
                    {planData.map((entry, i) => (
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
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Recent Companies</h2>
            <Link to="/admin/companies" className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] hover:text-[#9ee0d4] transition-colors flex items-center gap-1">
              View all <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          {data.recentCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-10 w-10 text-[#aaa9a5] mb-3" />
              <p className="text-white text-sm font-medium">No companies registered yet</p>
              <p className="text-[#aaa9a5] text-xs mt-1">Companies will appear here once business owners sign up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-white/[.08]">
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Company</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Plan</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Users</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Services</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Bookings</th>
                    <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentCompanies.map((c) => (
                    <tr key={c.id} className="border-b border-white/[.06] last:border-0">
                      <td className="py-3.5 text-white text-xs font-medium">{c.name}</td>
                      <td className="py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${
                          c.subscriptionPlan === 'PREMIUM' ? 'text-[#86d6c8] bg-[#86d6c8]/10' :
                          c.subscriptionPlan === 'BASIC' ? 'text-[#efc493] bg-[#efc493]/10' :
                          'text-[#7eb8da] bg-[#7eb8da]/10'
                        }`}>{c.subscriptionPlan}</span>
                      </td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{c._count.users}</td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{c._count.services}</td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{c._count.bookings}</td>
                      <td className="py-3.5">
                        <span className={`flex items-center gap-1 text-[10px] font-semibold ${c.isActive ? 'text-green-400' : 'text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${c.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                          {c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/admin/companies"
          className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#86d6c8]/40 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#86d6c8]/10 flex items-center justify-center group-hover:bg-[#86d6c8]/20 transition-all">
            <Building2 className="h-5 w-5 text-[#86d6c8]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Manage Businesses</p>
            <p className="text-[#aaa9a5] text-xs mt-0.5">View and manage all registered companies</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#86d6c8] transition-all" />
        </Link>
        <Link to="/admin/platform-stats"
          className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#efc493]/40 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#efc493]/10 flex items-center justify-center group-hover:bg-[#efc493]/20 transition-all">
            <BarChart3 className="h-5 w-5 text-[#efc493]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Platform Analytics</p>
            <p className="text-[#aaa9a5] text-xs mt-0.5">Detailed metrics and insights</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#efc493] transition-all" />
        </Link>
        <Link to="/admin/subscriptions"
          className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[#dce772]/40 transition-all group">
          <div className="w-12 h-12 rounded-xl bg-[#dce772]/10 flex items-center justify-center group-hover:bg-[#dce772]/20 transition-all">
            <Zap className="h-5 w-5 text-[#dce772]" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">Subscription Plans</p>
            <p className="text-[#aaa9a5] text-xs mt-0.5">Manage pricing and plan details</p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[#aaa9a5] ml-auto group-hover:text-[#dce772] transition-all" />
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
