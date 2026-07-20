import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { employeesApi } from '../../api/employees.api';
import type { Employee, WorkingHours, VacationDay } from '../../types/employee.types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Clock, CalendarDays, Sun, Trash } from 'lucide-react';

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
  const [form, setForm] = useState({ email: '', firstName: '', lastName: '', phone: '', bio: '' });
  const [saving, setSaving] = useState(false);

  // Working hours state
  const [whEmployeeId, setWhEmployeeId] = useState<string | null>(null);
  const [whSchedules, setWhSchedules] = useState<WorkingHours[]>([]);
  const [showWhModal, setShowWhModal] = useState(false);

  // Vacation state
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

  useEffect(() => { fetchEmployees(); }, [companyId]);

  const openCreate = () => {
    setEditingId(null);
    setForm({ email: '', firstName: '', lastName: '', phone: '', bio: '' });
    setShowModal(true);
  };

  const openEdit = (emp: Employee) => {
    setEditingId(emp.id);
    setForm({ email: emp.user.email, firstName: emp.user.firstName, lastName: emp.user.lastName, phone: emp.user.phone || '', bio: emp.bio || '' });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      if (editingId) {
        const updated = await employeesApi.update(editingId, form);
        setEmployees((prev) => prev.map((e) => (e.id === editingId ? updated as any as Employee : e)));
        toast.success('Employee updated');
      } else {
        const result = await employeesApi.create({ ...form, companyId });
        setEmployees((prev) => [...prev, result.employee]);
        if (result.tempPassword) {
          toast(`Password: ${result.tempPassword}`, { duration: 10000, icon: '🔑' });
        } else {
          toast.success('Employee added');
        }
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

  // Working Hours
  const openWorkingHours = async (emp: Employee) => {
    setWhEmployeeId(emp.id);
    if (!companyId) return;
    try {
      const hours = await employeesApi.getWorkingHours(emp.id, companyId);
      if (hours.length > 0) {
        setWhSchedules(hours);
      } else {
        setWhSchedules(defaultWorkingHours.map((wh) => ({ ...wh, employeeId: emp.id })));
      }
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

  // Vacation Days
  const openVacations = async (emp: Employee) => {
    setVacEmployeeId(emp.id);
    setNewVacDate('');
    setNewVacReason('');
    if (!companyId) return;
    try {
      const v = await employeesApi.getVacationDays(emp.id, companyId);
      setVacations(v);
    } catch {
      setVacations([]);
    }
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
    } catch {
      toast.error('Failed to add vacation day');
    }
  };

  const removeVacation = async (vacId: string) => {
    if (!vacEmployeeId || !companyId) return;
    try {
      await employeesApi.removeVacationDay(vacEmployeeId, vacId, companyId);
      setVacations((prev) => prev.filter((v) => v.id !== vacId));
      toast.success('Vacation day removed');
    } catch {
      toast.error('Failed to remove vacation day');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-gray-400 mt-1">Manage your team members</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#c5a880] py-2.5 px-5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Employee
        </button>
      </div>

      {employees.length === 0 ? (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No employees yet. Add your first team member.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.map((emp) => (
            <div key={emp.id} className="bg-[#121620] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#c5a880]/20 flex items-center justify-center text-[#c5a880] text-sm font-medium">
                  {emp.user.firstName[0]}{emp.user.lastName[0]}
                </div>
                <div>
                  <h3 className="text-white font-medium">{emp.user.firstName} {emp.user.lastName}</h3>
                  <p className="text-sm text-gray-400">{emp.user.email}</p>
                  {emp.specialties.length > 0 && (
                    <div className="flex gap-1.5 mt-1.5">
                      {emp.specialties.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-full bg-[#c5a880]/10 text-[#c5a880] text-[10px] font-medium">{s}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => openWorkingHours(emp)} className="p-2 text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer" title="Working Hours">
                  <Clock className="h-4 w-4" />
                </button>
                <button onClick={() => openVacations(emp)} className="p-2 text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer" title="Vacation Days">
                  <CalendarDays className="h-4 w-4" />
                </button>
                <button onClick={() => openEdit(emp)} className="p-2 text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer">
                  <Pencil className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(emp.id)} className="p-2 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">{editingId ? 'Edit Employee' : 'Add Employee'}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              {!editingId && (
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Email *</label>
                  <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors" placeholder="employee@company.com" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">First Name *</label>
                  <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Last Name *</label>
                  <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Phone</label>
                <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Bio</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={2} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880] transition-colors resize-none" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.email || !form.firstName || !form.lastName} className="flex-1 rounded-lg bg-[#c5a880] py-2.5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : editingId ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vacation Days Modal */}
      {showVacModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Sun className="h-5 w-5" /> Vacation Days</h2>
              <button onClick={() => setShowVacModal(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
              {vacations.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No vacation days set</p>
              ) : (
                vacations.map((v) => (
                  <div key={v.id} className="flex items-center justify-between bg-[#1a202c]/30 rounded-lg p-3">
                    <div>
                      <p className="text-white text-sm font-medium">{v.date.split('T')[0]}</p>
                      {v.reason && <p className="text-xs text-gray-400">{v.reason}</p>}
                    </div>
                    <button onClick={() => removeVacation(v.id)} className="p-1.5 text-gray-400 hover:text-red-400 transition-colors cursor-pointer">
                      <Trash className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="flex items-center gap-2">
              <input type="date" value={newVacDate} onChange={(e) => setNewVacDate(e.target.value)} className="flex-1 rounded-lg border border-white/5 bg-[#1a202c]/50 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
              <input value={newVacReason} onChange={(e) => setNewVacReason(e.target.value)} placeholder="Reason" className="flex-1 rounded-lg border border-white/5 bg-[#1a202c]/50 py-2.5 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
              <button onClick={addVacation} disabled={!newVacDate} className="rounded-lg bg-[#c5a880] py-2.5 px-4 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">Add</button>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowVacModal(false)} className="flex-1 rounded-lg border border-white/5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Working Hours Modal */}
      {showWhModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white flex items-center gap-2"><Clock className="h-5 w-5" /> Working Hours</h2>
              <button onClick={() => setShowWhModal(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {whSchedules.sort((a, b) => a.dayOfWeek - b.dayOfWeek).map((schedule) => (
                <div key={schedule.dayOfWeek} className="flex items-center gap-3 bg-[#1a202c]/30 rounded-lg p-3">
                  <div className="w-24 text-sm text-white font-medium">{DAYS[schedule.dayOfWeek]}</div>
                  <input type="time" value={schedule.startTime} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, startTime: e.target.value } : s))} className="rounded-lg border border-white/5 bg-[#0a0c10] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880] w-28" />
                  <span className="text-gray-500">to</span>
                  <input type="time" value={schedule.endTime} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, endTime: e.target.value } : s))} className="rounded-lg border border-white/5 bg-[#0a0c10] py-2 px-3 text-sm text-white focus:outline-none focus:border-[#c5a880] w-28" />
                  <label className="flex items-center gap-2 text-xs text-gray-400 ml-auto cursor-pointer">
                    <input type="checkbox" checked={schedule.isActive} onChange={(e) => setWhSchedules((prev) => prev.map((s) => s.dayOfWeek === schedule.dayOfWeek ? { ...s, isActive: e.target.checked } : s))} className="accent-[#c5a880]" />
                    Active
                  </label>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowWhModal(false)} className="flex-1 rounded-lg border border-white/5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
              <button onClick={saveWorkingHours} className="flex-1 rounded-lg bg-[#c5a880] py-2.5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all cursor-pointer">Save Schedule</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeesManagement;
