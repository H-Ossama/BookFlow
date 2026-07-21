import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { reportsApi } from '../../api/reports.api';
import toast from 'react-hot-toast';
import { FileText, FileSpreadsheet, FileDown, Download, CalendarDays, BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';

export function ReportsPage() {
  const { user } = useAuthContext();
  const [dateFrom, setDateFrom] = useState(() => new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]);
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState<string | null>(null);
  const companyId = user?.companyId;

  const download = async (type: string, fn: () => Promise<void>) => {
    if (!companyId) { toast.error('No company selected'); return; }
    setLoading(type);
    try { await fn(); toast.success(`${type} downloaded`); }
    catch { toast.error(`Failed to download ${type}`); }
    finally { setLoading(null); }
  };

  const sections = [
    {
      title: 'Bookings Report',
      desc: 'All bookings with service, employee, status, and pricing details.',
      icon: BarChart3,
      color: '#86d6c8',
      items: [
        { label: 'CSV', icon: FileText, type: 'bookings-csv', fn: () => reportsApi.downloadBookingsCSV(companyId!, dateFrom, dateTo) },
        { label: 'Excel', icon: FileSpreadsheet, type: 'bookings-excel', fn: () => reportsApi.downloadBookingsExcel(companyId!, dateFrom, dateTo) },
        { label: 'PDF', icon: FileDown, type: 'bookings-pdf', fn: () => reportsApi.downloadBookingsPDF(companyId!, dateFrom, dateTo) },
      ],
    },
    {
      title: 'Revenue Report',
      desc: 'Revenue breakdown by date with discounts and totals.',
      icon: DollarSign,
      color: '#dce772',
      items: [
        { label: 'CSV', icon: FileText, type: 'revenue-csv', fn: () => reportsApi.downloadRevenueCSV(companyId!, dateFrom, dateTo) },
        { label: 'PDF', icon: FileDown, type: 'revenue-pdf', fn: () => reportsApi.downloadRevenuePDF(companyId!, dateFrom, dateTo) },
      ],
    },
    {
      title: 'Customer Report',
      desc: 'Customer list with total spend and booking count.',
      icon: Users,
      color: '#7eb8da',
      items: [
        { label: 'CSV', icon: FileText, type: 'customers-csv', fn: () => reportsApi.downloadCustomersCSV(companyId!, dateFrom, dateTo) },
      ],
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Reports & Export</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Download booking, revenue, and customer reports</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">From</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
              className="rounded-lg border border-white/[.08] bg-white/[.06] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">To</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
              className="rounded-lg border border-white/[.08] bg-white/[.06] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[#aaa9a5] pb-2 font-mono">
            <CalendarDays className="h-3 w-3" />
            {dateFrom} → {dateTo}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="glass-card rounded-xl overflow-hidden">
              <div className="p-5 flex items-center gap-4" style={{ borderLeft: `3px solid ${section.color}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${section.color}15` }}>
                  <Icon className="h-5 w-5" style={{ color: section.color }} />
                </div>
                <div className="flex-1">
                  <h2 className="text-sm font-bold text-white font-serif tracking-tight">{section.title}</h2>
                  <p className="text-xs text-[#aaa9a5] mt-0.5">{section.desc}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  {section.items.map((item) => {
                    const isLoading = loading === item.type;
                    const ItemIcon = item.icon;
                    return (
                      <button key={item.type} onClick={() => download(item.type, item.fn)} disabled={isLoading || !companyId}
                        className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-white/[.08] text-xs text-[#aaa9a5] hover:text-white hover:border-white/[.2] transition-all disabled:opacity-40 cursor-pointer">
                        {isLoading ? <Download className="h-3.5 w-3.5 animate-pulse" /> : <ItemIcon className="h-3.5 w-3.5" />}
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReportsPage;
