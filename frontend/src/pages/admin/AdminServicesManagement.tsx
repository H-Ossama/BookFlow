import { useState, useEffect } from 'react';
import { servicesApi } from '../../api/services.api';
import { companiesApi } from '../../api/companies.api';
import type { Service } from '../../types/service.types';
import type { Company } from '../../types/company.types';
import toast from 'react-hot-toast';
import { Search, Clock, DollarSign, Scissors, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export function AdminServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    companiesApi.getAll({ limit: 200 }).then((res) => {
      setCompanies(res.companies || res.data || []);
    }).catch(() => toast.error('Failed to load companies'));
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    setLoading(true);
    servicesApi.getAll(selectedCompanyId, { limit: 200 })
      .then((result) => setServices(Array.isArray(result) ? result : result.services || []))
      .catch(() => toast.error('Failed to load services'))
      .finally(() => setLoading(false));
  }, [selectedCompanyId]);

  const filtered = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = services.filter((s) => s.isActive).length;
  const avgPrice = services.length > 0 ? services.reduce((a, s) => a + s.price, 0) / services.length : 0;


  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Services</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Browse services across companies</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-2">Select Company</label>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa9a5]" />
          <select value={selectedCompanyId} onChange={(e) => { setSelectedCompanyId(e.target.value); setSearch(''); }}
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
          <Building2 className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">Select a company above</p>
          <p className="text-[#aaa9a5] text-xs mt-1">Choose a company to view its services</p>
        </div>
      )}

      {selectedCompanyId && loading && (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
        </div>
      )}

      {selectedCompanyId && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{services.length}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Total Services</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{activeCount}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Active</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{services.length - activeCount}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1">Inactive</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">${avgPrice.toFixed(0)}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#efc493] mt-1">Avg Price</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-lg">
            <Search className="h-4 w-4 text-[#aaa9a5]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search services..." className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
              <Scissors className="h-10 w-10 text-[#aaa9a5] mb-4" />
              <p className="text-white text-sm font-medium">{search ? 'No services match' : 'No services yet'}</p>
              <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search' : 'This company has no services'}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((service) => (
                <div key={service.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${service.color || '#86d6c8'}18` }}>
                        <Scissors className="h-5 w-5" style={{ color: service.color || '#86d6c8' }} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-white font-medium text-sm">{service.name}</h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full ${service.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10' : 'text-[#aaa9a5] bg-white/[.06]'}`}>
                            {service.isActive ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#aaa9a5] mt-1">
                          <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {service.duration} min</span>
                          <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" /> ${service.price.toFixed(2)}</span>
                          {service.description && <span className="text-[#aaa9a5]/60 truncate max-w-[300px]">· {service.description}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminServicesManagement;
