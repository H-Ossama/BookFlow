import { useState, useEffect } from 'react';
import { companiesApi } from '../../api/companies.api';
import { adminApi } from '../../api/admin.api';
import type { Company } from '../../types/company.types';
import type { CompanyRevenue, RevenueByService } from '../../api/admin.api';
import toast from 'react-hot-toast';
import { Building2, DollarSign, TrendingUp, Calendar, Receipt, Percent, Hash } from 'lucide-react';

export function AdminRevenueManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [revenue, setRevenue] = useState<CompanyRevenue | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    companiesApi.getAll({ limit: 200 }).then((res) => {
      setCompanies(res.companies || res.data || []);
    }).catch(() => toast.error('Failed to load companies'));
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    setLoading(true);
    adminApi.getCompanyRevenue(selectedCompanyId)
      .then(setRevenue)
      .catch(() => toast.error('Failed to load revenue data'))
      .finally(() => setLoading(false));
  }, [selectedCompanyId]);

  const maxRevenue = revenue ? Math.max(...revenue.revenueByService.map((s) => s.totalRevenue), 1) : 1;
  const selectedCompany = companies.find((c) => c.id === selectedCompanyId);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Revenue</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">View revenue breakdown by service for each company</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-2">Select Company</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa9a5]" />
          <select value={selectedCompanyId} onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors appearance-none cursor-pointer">
            <option value="" className="bg-[#1a1a1a]">-- Choose a company --</option>
            {companies.map((c) => (
              <option key={c.id} value={c.id} className="bg-[#1a1a1a]">{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {!selectedCompanyId && (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <TrendingUp className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">Select a company above</p>
          <p className="text-[#aaa9a5] text-xs mt-1">Choose a company to view its revenue breakdown</p>
        </div>
      )}

      {selectedCompanyId && loading && (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
        </div>
      )}

      {selectedCompanyId && !loading && revenue && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">${revenue.summary.netRevenue.toFixed(2)}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1 flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Net Revenue
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">${revenue.summary.totalRevenue.toFixed(2)}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1 flex items-center gap-1">
                <Receipt className="h-3 w-3" /> Gross Revenue
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{revenue.summary.totalBookings}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1 flex items-center gap-1">
                <Hash className="h-3 w-3" /> Completed Bookings
              </p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">${revenue.summary.averageBookingValue.toFixed(2)}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#efc493] mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> Avg Booking Value
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <Calendar className="h-4 w-4 text-[#86d6c8]" /> This Month
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xl font-bold text-white">${revenue.periodRevenue.revenue.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-[#aaa9a5]">{revenue.periodRevenue.bookings} bookings</p>
                </div>
                {revenue.periodRevenue.discount > 0 && (
                  <div className="text-right ml-auto">
                    <p className="text-xs text-[#aaa9a5]">Discounts</p>
                    <p className="text-sm text-red-400">-${revenue.periodRevenue.discount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-sm font-bold text-white flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-[#efc493]" /> This Year
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div>
                  <p className="text-xl font-bold text-white">${revenue.yearRevenue.revenue.toFixed(2)}</p>
                  <p className="text-[10px] font-mono text-[#aaa9a5]">{revenue.yearRevenue.bookings} bookings</p>
                </div>
                {revenue.yearRevenue.discount > 0 && (
                  <div className="text-right ml-auto">
                    <p className="text-xs text-[#aaa9a5]">Discounts</p>
                    <p className="text-sm text-red-400">-${revenue.yearRevenue.discount.toFixed(2)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-bold text-white font-serif tracking-tight mb-4">Revenue by Service</h2>
            {revenue.revenueByService.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-[#aaa9a5] text-sm">No completed bookings yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {revenue.revenueByService.map((service: RevenueByService) => {
                  const pct = (service.totalRevenue / maxRevenue) * 100;
                  const share = revenue.summary.totalRevenue > 0 ? (service.totalRevenue / revenue.summary.totalRevenue) * 100 : 0;
                  return (
                    <div key={service.serviceId} className="glass-card rounded-xl p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-white font-medium text-sm">{service.serviceName}</h3>
                          <p className="text-xs text-[#aaa9a5] mt-0.5">{service.bookingCount} bookings &middot; Avg ${service.avgPrice.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">${service.totalRevenue.toFixed(2)}</p>
                          <p className="text-[10px] text-[#86d6c8] font-mono">{share.toFixed(1)}% of revenue</p>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-white/[.06] overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-[#86d6c8] to-[#86d6c8]/60 transition-all duration-500"
                          style={{ width: `${pct}%` }} />
                      </div>
                      {service.totalDiscount > 0 && (
                        <p className="text-[10px] text-red-400/70 mt-1">Discounts applied: -${service.totalDiscount.toFixed(2)}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg font-bold text-white font-serif tracking-tight mb-4">Recent Transactions</h2>
            {revenue.recentTransactions.length === 0 ? (
              <div className="glass-card rounded-xl p-8 text-center">
                <p className="text-[#aaa9a5] text-sm">No recent transactions</p>
              </div>
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/[.08]">
                        <th className="text-left py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Date</th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Service</th>
                        <th className="text-left py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Employee</th>
                        <th className="text-right py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Amount</th>
                        <th className="text-right py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Discount</th>
                        <th className="text-right py-3 px-4 text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8]">Net</th>
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.recentTransactions.map((tx) => (
                        <tr key={tx.id} className="border-b border-white/[.04] hover:bg-white/[.02] transition-colors">
                          <td className="py-3 px-4 text-white text-xs whitespace-nowrap">
                            {new Date(tx.date).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 text-white text-xs">{tx.service}</td>
                          <td className="py-3 px-4 text-[#aaa9a5] text-xs">{tx.employee}</td>
                          <td className="py-3 px-4 text-white text-xs text-right">${tx.amount.toFixed(2)}</td>
                          <td className="py-3 px-4 text-red-400 text-xs text-right">
                            {tx.discount > 0 ? `-$${tx.discount.toFixed(2)}` : '-'}
                          </td>
                          <td className="py-3 px-4 text-[#86d6c8] text-xs text-right font-medium">
                            ${(tx.amount - tx.discount).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default AdminRevenueManagement;
