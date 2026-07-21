import { useState, useEffect } from 'react';
import { employeesApi } from '../../api/employees.api';
import { companiesApi } from '../../api/companies.api';
import type { Employee, WorkingHours } from '../../types/employee.types';
import type { Company } from '../../types/company.types';
import toast from 'react-hot-toast';
import { Search, Users, Mail, Phone, Briefcase, Building2, CheckCircle2, XCircle, X, Clock } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export function AdminEmployeesManagement() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [, setWhEmployeeId] = useState<string | null>(null);
  const [whSchedules, setWhSchedules] = useState<WorkingHours[]>([]);
  const [showWhModal, setShowWhModal] = useState(false);

  useEffect(() => {
    companiesApi.getAll({ limit: 200 }).then((res) => {
      setCompanies(res.companies || res.data || []);
    }).catch(() => toast.error('Failed to load companies'));
  }, []);

  useEffect(() => {
    if (!selectedCompanyId) return;
    setLoading(true);
    employeesApi.getAll(selectedCompanyId)
      .then(setEmployees)
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, [selectedCompanyId]);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return `${e.user.firstName} ${e.user.lastName} ${e.user.email}`.toLowerCase().includes(q);
  });

  const activeEmployees = employees.filter((e) => e.isActive).length;

  const openWorkingHours = async (emp: Employee) => {
    setWhEmployeeId(emp.id);
    if (!selectedCompanyId) return;
    try {
      const hours = await employeesApi.getWorkingHours(emp.id, selectedCompanyId);
      setWhSchedules(hours.length > 0 ? hours : DAYS.map((_, i) => ({
        id: '', employeeId: emp.id, dayOfWeek: i,
        startTime: '09:00', endTime: '17:00', isActive: i !== 0 && i !== 6,
      })));
    } catch {
      setWhSchedules(DAYS.map((_, i) => ({
        id: '', employeeId: emp.id, dayOfWeek: i,
        startTime: '09:00', endTime: '17:00', isActive: i !== 0 && i !== 6,
      })));
    }
    setShowWhModal(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Employees</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Browse employees across companies</p>
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
          <p className="text-[#aaa9a5] text-xs mt-1">Choose a company to view its employees</p>
        </div>
      )}

      {selectedCompanyId && loading && (
        <div className="flex items-center justify-center h-64">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
        </div>
      )}

      {selectedCompanyId && !loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{employees.length}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Total Employees</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{activeEmployees}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Active</p>
            </div>
            <div className="glass-card rounded-xl p-4">
              <p className="text-2xl font-bold text-white">{employees.length - activeEmployees}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1">Inactive</p>
            </div>
          </div>

          <div className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-lg">
            <Search className="h-4 w-4 text-[#aaa9a5]" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employees by name or email..." className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
              <Users className="h-10 w-10 text-[#aaa9a5] mb-4" />
              <p className="text-white text-sm font-medium">{search ? 'No employees match' : 'No employees yet'}</p>
              <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search' : 'This company has no employees'}</p>
            </div>
          ) : (
            <div className="grid gap-3">
              {filtered.map((emp) => (
                <div key={emp.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#86d6c8]/20 to-[#efc493]/20 flex items-center justify-center text-sm font-bold text-white">
                        {emp.user.firstName[0]}{emp.user.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5">
                          <h3 className="text-white font-medium text-sm">{emp.user.firstName} {emp.user.lastName}</h3>
                          <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full ${emp.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10' : 'text-[#aaa9a5] bg-white/[.06]'}`}>
                            {emp.isActive ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                            {emp.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-[#aaa9a5] mt-1 flex-wrap">
                          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {emp.user.email}</span>
                          {emp.user.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {emp.user.phone}</span>}
                          {emp.specialties.length > 0 && (
                            <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" /> {emp.specialties.join(', ')}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => openWorkingHours(emp)}
                      className="px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] text-[#86d6c8] bg-[#86d6c8]/10 hover:bg-[#86d6c8]/20 transition-all cursor-pointer flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Hours
                    </button>
                  </div>
                  {emp.bio && <p className="text-[#aaa9a5] text-xs mt-3 pl-14">{emp.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showWhModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowWhModal(false)}>
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight flex items-center gap-2"><Clock className="h-5 w-5 text-[#86d6c8]" /> Working Hours</h2>
              <button onClick={() => setShowWhModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
              {whSchedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((schedule) => (
                <div key={schedule.dayOfWeek} className="flex items-center gap-3 bg-white/[.03] border border-white/[.06] rounded-lg p-3">
                  <div className="w-20 text-sm text-white font-medium">{DAYS[schedule.dayOfWeek].slice(0, 3)}</div>
                  <input type="time" value={schedule.startTime} readOnly
                    className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-2.5 text-sm text-white focus:outline-none w-26" />
                  <span className="text-[#aaa9a5] text-xs">to</span>
                  <input type="time" value={schedule.endTime} readOnly
                    className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-2.5 text-sm text-white focus:outline-none w-26" />
                  <span className={`ml-auto text-[10px] font-mono uppercase ${schedule.isActive ? 'text-[#86d6c8]' : 'text-[#aaa9a5]'}`}>
                    {schedule.isActive ? 'Active' : 'Off'}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowWhModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminEmployeesManagement;
