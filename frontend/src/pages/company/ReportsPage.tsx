import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { reportsApi } from '../../api/reports.api';
import toast from 'react-hot-toast';
import { FileText, FileSpreadsheet, FileDown, Download } from 'lucide-react';

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
      items: [
        { label: 'CSV', icon: FileText, type: 'bookings-csv', fn: () => reportsApi.downloadBookingsCSV(companyId!, dateFrom, dateTo) },
        { label: 'Excel', icon: FileSpreadsheet, type: 'bookings-excel', fn: () => reportsApi.downloadBookingsExcel(companyId!, dateFrom, dateTo) },
        { label: 'PDF', icon: FileDown, type: 'bookings-pdf', fn: () => reportsApi.downloadBookingsPDF(companyId!, dateFrom, dateTo) },
      ],
    },
    {
      title: 'Revenue Report',
      desc: 'Revenue breakdown by date with discounts and totals.',
      items: [
        { label: 'CSV', icon: FileText, type: 'revenue-csv', fn: () => reportsApi.downloadRevenueCSV(companyId!, dateFrom, dateTo) },
        { label: 'PDF', icon: FileDown, type: 'revenue-pdf', fn: () => reportsApi.downloadRevenuePDF(companyId!, dateFrom, dateTo) },
      ],
    },
    {
      title: 'Customer Report',
      desc: 'Customer list with total spend and booking count.',
      items: [
        { label: 'CSV', icon: FileText, type: 'customers-csv', fn: () => reportsApi.downloadCustomersCSV(companyId!, dateFrom, dateTo) },
      ],
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Reports & Export</h1>
        <p className="text-gray-400 mt-1">Download booking, revenue, and customer reports</p>
      </div>

      <div className="flex items-end gap-4 bg-[#121620] border border-white/5 rounded-xl p-5">
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">From</label>
          <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-lg border border-white/5 bg-[#1a202c]/50 py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">To</label>
          <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
            className="rounded-lg border border-white/5 bg-[#1a202c]/50 py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
        </div>
        <div className="text-xs text-gray-500 pb-2">Showing data from {dateFrom} to {dateTo}</div>
      </div>

      <div className="space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-[#121620] border border-white/5 rounded-xl p-5">
            <h2 className="text-lg font-bold text-white mb-1">{section.title}</h2>
            <p className="text-sm text-gray-400 mb-4">{section.desc}</p>
            <div className="flex flex-wrap gap-3">
              {section.items.map((item) => {
                const isLoading = loading === item.type;
                return (
                  <button key={item.type} onClick={() => download(item.type, item.fn)} disabled={isLoading || !companyId}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1a202c]/50 border border-white/5 text-sm text-gray-300 hover:text-white hover:border-white/10 transition-all disabled:opacity-50 cursor-pointer">
                    {isLoading ? <Download className="h-4 w-4 animate-pulse" /> : <item.icon className="h-4 w-4" />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportsPage;
