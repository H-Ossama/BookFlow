import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { employeesApi } from '../../api/employees.api';
import { rolesApi } from '../../api/roles.api';
import type { Employee, WorkingHours, VacationDay, CompanyRole } from '../../types/employee.types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Clock, CalendarDays, Sun, Search, Users, Mail, Phone, Briefcase, CheckCircle2, XCircle, Shield } from 'lucide-react';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const defaultWorkingHours: WorkingHours[] = DAYS.map((_, i) => ({
  id: '',
  employeeId: '',
  dayOfWeek: i,
  startTime: '09:00',
  endTime: '17:00',
  isActive: i !== 0 && i !== 6,
}));

export function EmployeesManagement() {
  const { user } = useAuthContext();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', phone: '', bio: '', companyRoleId: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const [whEmployeeId, setWhEmployeeId] = useState<string | null>(null);
  const [whSchedules, setWhSchedules] = useState<WorkingHours[]>([]);
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [showWhModal, setShowWhModal] = useState(false);

  const [vacEmployeeId, setVacEmployeeId] = useState<string | null>(null);
  const [vacations, setVacations] = useState<VacationDay[]>([]);
  const [showVacModal, setShowVacModal] = useState(false);
  const [newVacDate, setNewVacDate] = useState('');
  const [newVacReason, setNewVacReason] = useState('');

  const companyId = user?.companyId;

  const fetchEmployees = async () => {
    if (!companyId) return;
    try {
      const data = await employeesApi.getAll(companyId);
      setEmployees(data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch { /* roles not critical */ }
  };

  useEffect(() => { fetchEmployees(); fetchRoles(); }, [companyId]);

  const filtered = employees.filter((e) => {
    const q = search.toLowerCase();
    return `${e.user.firstName} ${e.user.lastName} ${e.user.email}`.toLowerCase().includes(q);
  });

  const activeEmployees = employees.filter((e) => e.isActive).length;

  const openCreate = () => {
    setEditingId(null);
    setForm({ email: '', firstName: '', lastName: '', phone: '', bio: '', companyRoleId: '' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setForm({ email: emp.user.email, firstName: emp.user.firstName, lastName: emp.user.lastName, phone: emp.user.phone || '', bio: emp.bio || '', companyRoleId: emp.user.companyRoleId || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      if (editingId) {
        const updateData: any = { firstName: form.firstName, lastName: form.lastName, phone: form.phone, bio: form.bio };
        if (form.companyRoleId) updateData.companyRoleId = form.companyRoleId;
        else updateData.companyRoleId = null;
        const updated = await employeesApi.update(editingId, updateData);
        setEmployees((prev) => prev.map((e) => (e.id === editingId ? { ...e, ...updated, user: { ...e.user, ...updated.user } } : e)));
        toast.success('Employee updated');
      } else {
        const result = await employeesApi.create({ ...form, companyId });
        setEmployees((prev) => [...prev, result.employee]);
        if (result.tempPassword) {
          toast(`Temporary password: ${result.tempPassword}`, { duration: 10000, icon: '' });
        }
        toast.success('Employee added');
      }
      setShowModal(false);
    } catch {
      toast.error('Failed to save employee');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!companyId) return;
    if (!confirm('Remove this employee?')) return;
    try {
      await employeesApi.delete(id, companyId);
      setEmployees((prev) => prev.filter((e) => e.id !== id));
      toast.success('Employee removed');
    } catch {
      toast.error('Failed to remove employee');
    }
  };

  const openWorkingHours = async (emp: Employee) => {
    setWhEmployeeId(emp.id);
    if (!companyId) return;
    try {
      const hours = await employeesApi.getWorkingHours(emp.id, companyId);
      setWhSchedules(hours.length > 0 ? hours : defaultWorkingHours.map((wh) => ({ ...wh, employeeId: emp.id })));
    } catch {
      setWhSchedules(defaultWorkingHours.map((wh) => ({ ...wh, employeeId: emp.id })));
    }
    setShowWhModal(true);
  };

  const saveWorkingHours = async () => {
    if (!whEmployeeId || !companyId) return;
    try {
      await employeesApi.setWorkingHours(whEmployeeId, companyId, whSchedules.map((s) => ({ dayOfWeek: s.dayOfWeek, startTime: s.startTime, endTime: s.endTime, isActive: s.isActive })));
      toast.success('Working hours saved');
      setShowWhModal(false);
    } catch {
      toast.error('Failed to save working hours');
    }
  };

  const openVacations = async (emp: Employee) => {
    setVacEmployeeId(emp.id);
    setNewVacDate('');
    setNewVacReason('');
    if (!companyId) return;
    try {
      const v = await employeesApi.getVacationDays(emp.id, companyId);
      setVacations(v);
    } catch { setVacations([]); }
    setShowVacModal(true);
  };

  const addVacation = async () => {
    if (!vacEmployeeId || !companyId || !newVacDate) return;
    try {
      await employeesApi.addVacationDay(vacEmployeeId, companyId, { date: newVacDate, reason: newVacReason || undefined });
      const v = await employeesApi.getVacationDays(vacEmployeeId, companyId);
      setVacations(v);
      setNewVacDate('');
      setNewVacReason('');
      toast.success('Vacation day added');
    } catch { toast.error('Failed to add vacation day'); }
  };

  const removeVacation = async (vacId: string) => {
    if (!vacEmployeeId || !companyId) return;
    try {
      await employeesApi.removeVacationDay(vacEmployeeId, vacId, companyId);
      setVacations((prev) => prev.filter((v) => v.id !== vacId));
      toast.success('Vacation day removed');
    } catch { toast.error('Failed to remove vacation day'); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Employees</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Manage your team members</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 px-5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

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
          placeholder="Search employees by name or email..."
          className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <Users className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">{search ? 'No employees match your search' : 'No employees yet'}</p>
          <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search term' : 'Add your first team member to get started'}</p>
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
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full ${
                         emp.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10' : 'text-[#aaa9a5] bg-white/[.06]'
                       }`}>
                         {emp.isActive ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                         {emp.isActive ? 'Active' : 'Inactive'}
                       </span>
                       {emp.user.companyRole && (
                         <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full text-[#7eb8da] bg-[#7eb8da]/10">
                           <Shield className="h-2.5 w-2.5" />
                           {emp.user.companyRole.name}
                         </span>
                       )}
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
                <div className="flex items-center gap-2">
                  <button onClick={() => openWorkingHours(emp)} className="px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] text-[#86d6c8] bg-[#86d6c8]/10 hover:bg-[#86d6c8]/20 transition-all cursor-pointer flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> Hours
                  </button>
                  <button onClick={() => openVacations(emp)} className="px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] text-[#efc493] bg-[#efc493]/10 hover:bg-[#efc493]/20 transition-all cursor-pointer flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" /> Days Off
                  </button>
                  <button onClick={() => openEdit(emp)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(emp.id)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {emp.bio && <p className="text-[#aaa9a5] text-xs mt-3 pl-14">{emp.bio}</p>}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {!editingId && (
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Email *</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors"
                    placeholder="employee@company.com" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">First Name *</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Last Name *</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors"
                  placeholder="+1 (555) 123-4567" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Bio / Specialties</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors resize-none"
                  placeholder="e.g. Senior stylist, specializes in color treatment" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Staff Role</label>
                <select value={form.companyRoleId} onChange={(e) => setForm({ ...form, companyRoleId: e.target.value })}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors">
                  <option value="" className="bg-[#1a1d24]">No role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id} className="bg-[#1a1d24]">{role.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || (!editingId && (!form.email || !form.firstName || !form.lastName))}
                className="flex-1 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : editingId ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </div>
        </div>
      )}

      {showVacModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowVacModal(false)}>
          <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight flex items-center gap-2"><Sun className="h-5 w-5 text-[#efc493]" /> Vacation Days</h2>
              <button onClick={() => setShowVacModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-2 max-h-56 overflow-y-auto mb-4">
              {vacations.length === 0 ? (
                <p className="text-[#aaa9a5] text-sm text-center py-4">No vacation days set</p>
              ) : (
                vacations.map((v) => (
                  <div key={v.id} className="flex items-center justify-between bg-white/[.03] border border-white/[.06] rounded-lg p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{v.date.split('T')[0]}</p>
                      {v.reason && <p className="text-[10px] text-[#aaa9a5] mt-0.5">{v.reason}</p>}
                    </div>
                    <button onClick={() => removeVacation(v.id)} className="p-1.5 text-[#aaa9a5] hover:text-red-400 transition-colors cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2">
              <input type="date" value={newVacDate} onChange={(e) => setNewVacDate(e.target.value)}
                className="rounded-lg border border-white/[.08] bg-white/[.06] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8] min-w-0" />
              <input value={newVacReason} onChange={(e) => setNewVacReason(e.target.value)} placeholder="Reason (optional)"
                className="rounded-lg border border-white/[.08] bg-white/[.06] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#86d6c8] min-w-0" />
              <button onClick={addVacation} disabled={!newVacDate}
                className="rounded-lg bg-[#86d6c8] px-4 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap">Add</button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowVacModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Close</button>
            </div>
          </div>
        </div>
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
                  <input type="time" value={schedule.startTime} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, startTime: e.target.value } : s))}
                    className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-2.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] w-26" />
                  <span className="text-[#aaa9a5] text-xs">to</span>
                  <input type="time" value={schedule.endTime} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, endTime: e.target.value } : s))}
                    className="rounded-lg border border-white/[.08] bg-white/[.06] py-1.5 px-2.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] w-26" />
                  <label className="flex items-center gap-1.5 text-[10px] text-[#aaa9a5] ml-auto cursor-pointer">
                    <input type="checkbox" checked={schedule.isActive} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, isActive: e.target.checked } : s))}
                      className="accent-[#86d6c8]" />
                    Active
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowWhModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Cancel</button>
              <button onClick={saveWorkingHours} className="flex-1 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">Save Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesManagement;
