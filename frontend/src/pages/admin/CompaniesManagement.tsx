import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../api/admin.api';
import {
  Building2, Search, Plus, Power, AlertTriangle, Filter,
  ArrowUpRight, Mail, Phone, MapPin, CalendarDays, Users, Scissors,
  BookOpen, Star, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  subscriptionPlan: string;
  isActive: boolean;
  createdAt: string;
  _count: { users: number; services: number; employees: number; bookings: number; reviews: number };
}

export function CompaniesManagement() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const result = await adminApi.getCompanies({
        page,
        limit: 15,
        search: search || undefined,
        plan: planFilter || undefined,
        isActive: statusFilter || undefined,
      });
      setCompanies(result.companies);
      setTotalPages(result.totalPages);
      setTotal(result.total);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [page, search, planFilter, statusFilter]);

  useEffect(() => { fetchCompanies(); }, [fetchCompanies]);

  useEffect(() => { setPage(1); }, [search, planFilter, statusFilter]);

  const handleViewDetail = async (company: Company) => {
    setSelectedCompany(company);
    setDetailLoading(true);
    try {
      const data = await adminApi.getCompanyDetail(company.id);
      setDetailData(data);
    } catch {
      setDetailData(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await adminApi.updateCompany(id, { isActive: !currentActive });
      fetchCompanies();
      if (selectedCompany?.id === id) {
        setSelectedCompany((prev) => prev ? { ...prev, isActive: !currentActive } : null);
      }
    } catch {
      // silent fail
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await adminApi.deleteCompany(id);
      setShowDeleteConfirm(null);
      setSelectedCompany(null);
      fetchCompanies();
    } catch {
      // silent fail
    } finally {
      setDeleting(false);
    }
  };

  const PLAN_STYLES: Record<string, string> = {
    FREE: 'text-[#7eb8da] bg-[#7eb8da]/10',
    BASIC: 'text-[#efc493] bg-[#efc493]/10',
    PREMIUM: 'text-[#86d6c8] bg-[#86d6c8]/10',
  };

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Businesses</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">{total} registered companies on the platform</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa9a5]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or slug..."
            className="w-full rounded-lg glass-card border border-white/[.08] py-2 pl-9 pr-3 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8]" />
        </div>
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}
          className="rounded-lg glass-card border border-white/[.08] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]">
          <option value="">All Plans</option>
          <option value="FREE">Free</option>
          <option value="BASIC">Basic</option>
          <option value="PREMIUM">Premium</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg glass-card border border-white/[.08] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8]">
          <option value="">All Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="glass-card rounded-xl overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
              </div>
            ) : companies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Building2 className="h-10 w-10 text-[#aaa9a5] mb-3" />
                <p className="text-white text-sm font-medium">No companies found</p>
                <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search term' : 'No companies registered yet'}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-white/[.08]">
                      <th className="p-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Company</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Plan</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Activity</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Status</th>
                      <th className="p-4 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.map((company) => (
                      <tr key={company.id}
                        onClick={() => handleViewDetail(company)}
                        className="border-b border-white/[.06] last:border-0 hover:bg-white/[.02] transition-colors cursor-pointer">
                        <td className="p-4">
                          <div>
                            <p className="text-white text-xs font-medium">{company.name}</p>
                            <p className="text-[10px] text-[#aaa9a5] mt-0.5">/{company.slug}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${PLAN_STYLES[company.subscriptionPlan] || ''}`}>
                            {company.subscriptionPlan}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3 text-[10px] text-[#aaa9a5]">
                            <span className="flex items-center gap-1"><Users className="h-3 w-3" />{company._count.users}</span>
                            <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{company._count.bookings}</span>
                            <span className="flex items-center gap-1"><Star className="h-3 w-3" />{company._count.reviews}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`flex items-center gap-1 text-[10px] font-semibold ${company.isActive ? 'text-green-400' : 'text-red-400'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${company.isActive ? 'bg-green-400' : 'bg-red-400'}`} />
                            {company.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); handleToggleActive(company.id, company.isActive); }}
                              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                company.isActive ? 'text-red-400 hover:bg-red-400/10' : 'text-green-400 hover:bg-green-400/10'
                              }`} title={company.isActive ? 'Deactivate' : 'Activate'}>
                              <Power className={`h-3.5 w-3.5 ${company.isActive ? '' : 'opacity-50'}`} />
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(company.id); }}
                              className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer" title="Delete">
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-4 border-t border-white/[.08]">
                <p className="text-[10px] text-[#aaa9a5]">Page {page} of {totalPages}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer">
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="glass-card rounded-xl p-5">
          <h2 className="text-sm font-bold text-white font-serif tracking-tight mb-4">Company Details</h2>
          {!selectedCompany ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-8 w-8 text-[#aaa9a5] mb-2" />
              <p className="text-[#aaa9a5] text-xs">Select a company to view details</p>
            </div>
          ) : detailLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="h-6 w-6 animate-spin rounded-full border-3 border-[#86d6c8] border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h3 className="text-white text-sm font-medium">{selectedCompany.name}</h3>
                <p className="text-[10px] text-[#aaa9a5]">/{selectedCompany.slug}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${PLAN_STYLES[selectedCompany.subscriptionPlan] || ''}`}>
                  {selectedCompany.subscriptionPlan}
                </span>
                <span className={`px-2 py-0.5 rounded text-[9px] font-semibold uppercase ${selectedCompany.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                  {selectedCompany.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {selectedCompany.description && (
                <p className="text-[#aaa9a5] text-xs">{selectedCompany.description}</p>
              )}
              <div className="space-y-2 text-xs">
                {selectedCompany.email && (
                  <div className="flex items-center gap-2 text-[#aaa9a5]">
                    <Mail className="h-3.5 w-3.5 shrink-0" />{selectedCompany.email}
                  </div>
                )}
                {selectedCompany.phone && (
                  <div className="flex items-center gap-2 text-[#aaa9a5]">
                    <Phone className="h-3.5 w-3.5 shrink-0" />{selectedCompany.phone}
                  </div>
                )}
                {selectedCompany.address && (
                  <div className="flex items-center gap-2 text-[#aaa9a5]">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />{selectedCompany.address}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[#aaa9a5]">
                  <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                  Joined {new Date(selectedCompany.createdAt).toLocaleDateString()}
                </div>
              </div>

              {detailData && (
                <>
                  <div className="border-t border-white/[.08] pt-4">
                    <h4 className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] font-semibold mb-3">Overview</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/[.03] rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{detailData._count.users}</p>
                        <p className="text-[9px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Users</p>
                      </div>
                      <div className="bg-white/[.03] rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{detailData._count.employees}</p>
                        <p className="text-[9px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Employees</p>
                      </div>
                      <div className="bg-white/[.03] rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{detailData._count.services}</p>
                        <p className="text-[9px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Services</p>
                      </div>
                      <div className="bg-white/[.03] rounded-lg p-3 text-center">
                        <p className="text-lg font-bold text-white">{detailData._count.bookings}</p>
                        <p className="text-[9px] font-mono uppercase tracking-[.08em] text-[#aaa9a5]">Bookings</p>
                      </div>
                    </div>
                  </div>

                  {detailData.recentBookings && detailData.recentBookings.length > 0 && (
                    <div className="border-t border-white/[.08] pt-4">
                      <h4 className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] font-semibold mb-2">Recent Bookings</h4>
                      <div className="space-y-1.5">
                        {detailData.recentBookings.slice(0, 5).map((b: any) => (
                          <div key={b.id} className="flex items-center justify-between py-1.5 text-[10px]">
                            <span className="text-white">{b.service.name}</span>
                            <span className="text-[#aaa9a5]">{b.startTime}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="border-t border-white/[.08] pt-4 flex gap-2">
                <button onClick={() => handleToggleActive(selectedCompany.id, selectedCompany.isActive)}
                  className={`flex-1 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[.08em] transition-all cursor-pointer ${
                    selectedCompany.isActive
                      ? 'bg-red-400/10 text-red-400 hover:bg-red-400/20'
                      : 'bg-green-400/10 text-green-400 hover:bg-green-400/20'
                  }`}>
                  {selectedCompany.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button onClick={() => setShowDeleteConfirm(selectedCompany.id)}
                  className="flex-1 py-2 rounded-lg text-[10px] font-semibold uppercase tracking-[.08em] bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-all cursor-pointer">
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-400/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white text-sm font-medium">Delete Company</h3>
                <p className="text-[#aaa9a5] text-xs">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[#aaa9a5] text-xs mb-6">
              All associated data (bookings, services, employees, reviews) will be permanently deleted.
              Users will be disassociated from this company.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-[#aaa9a5] hover:text-white bg-white/[.06] hover:bg-white/[.1] transition-all cursor-pointer disabled:opacity-50">
                Cancel
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} disabled={deleting}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2">
                {deleting ? (
                  <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Deleting...</>
                ) : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompaniesManagement;
