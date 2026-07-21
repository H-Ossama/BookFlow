import { useState, useEffect } from 'react';
import { rolesApi } from '../../api/roles.api';
import type { CompanyRole } from '../../types/employee.types';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, Shield, Users } from 'lucide-react';

const ALL_PERMISSIONS = [
  { key: 'dashboard', label: 'Dashboard', desc: 'View main dashboard overview' },
  { key: 'bookings', label: 'Bookings', desc: 'Manage all bookings' },
  { key: 'services', label: 'Services', desc: 'Manage services catalog' },
  { key: 'employees', label: 'Employees', desc: 'View and manage team members' },
  { key: 'coupons', label: 'Coupons', desc: 'Manage discount coupons' },
  { key: 'reviews', label: 'Reviews', desc: 'View and manage reviews' },
  { key: 'reports', label: 'Reports', desc: 'View analytics and reports' },
  { key: 'subscription', label: 'Subscription', desc: 'View subscription details' },
  { key: 'settings', label: 'Settings', desc: 'Access company settings' },
];

export function RolesManagement() {
  const [roles, setRoles] = useState<CompanyRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', permissions: [] as string[] });
  const [saving, setSaving] = useState(false);

  const fetchRoles = async () => {
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch {
      toast.error('Failed to load roles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRoles(); }, []);

  const openCreate = () => {
    setEditingId(null);
    setForm({ name: '', description: '', permissions: ['dashboard'] });
    setShowModal(true);
  };

  const openEdit = (role: CompanyRole) => {
    setEditingId(role.id);
    setForm({ name: role.name, description: role.description || '', permissions: role.permissions });
    setShowModal(true);
  };

  const togglePermission = (key: string) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(key)
        ? prev.permissions.filter((p) => p !== key)
        : [...prev.permissions, key],
    }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('Role name is required'); return; }
    if (form.permissions.length === 0) { toast.error('Select at least one permission'); return; }
    setSaving(true);
    try {
      if (editingId) {
        await rolesApi.update(editingId, form);
        toast.success('Role updated');
      } else {
        await rolesApi.create(form);
        toast.success('Role created');
      }
      setShowModal(false);
      fetchRoles();
    } catch {
      toast.error('Failed to save role');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this role? Employees with this role will lose their permissions.')) return;
    try {
      await rolesApi.delete(id);
      setRoles((prev) => prev.filter((r) => r.id !== id));
      toast.success('Role deleted');
    } catch {
      toast.error('Failed to delete role');
    }
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
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Staff Roles</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Define roles and permissions for your team members</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 px-5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Create Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <Shield className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">No roles defined yet</p>
          <p className="text-[#aaa9a5] text-xs mt-1">Create roles like &quot;SEO Manager&quot; or &quot;Chief Employee Manager&quot; to control dashboard access</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {roles.map((role) => (
            <div key={role.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#86d6c8]/20 to-[#7eb8da]/20 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-[#86d6c8]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-white font-medium text-sm">{role.name}</h3>
                      {role.isDefault && (
                        <span className="text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full text-[#efc493] bg-[#efc493]/10">Default</span>
                      )}
                    </div>
                    {role.description && <p className="text-[#aaa9a5] text-xs mt-0.5">{role.description}</p>}
                    {role._count && (
                      <p className="flex items-center gap-1 text-[10px] text-[#aaa9a5] mt-1">
                        <Users className="h-3 w-3" /> {role._count.users} member{role._count.users !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => openEdit(role)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-all cursor-pointer">
                    <Pencil className="h-4 w-4" />
                  </button>
                  {!role.isDefault && (
                    <button onClick={() => handleDelete(role.id)} className="p-2 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-all cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ALL_PERMISSIONS.map((perm) => (
                  <span key={perm.key}
                    className={`text-[10px] font-mono uppercase tracking-[.06em] px-2 py-1 rounded-md transition-colors ${
                      role.permissions.includes(perm.key)
                        ? 'text-[#86d6c8] bg-[#86d6c8]/10'
                        : 'text-[#555] bg-white/[.03]'
                    }`}>
                    {perm.label}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-lg glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">{editingId ? 'Edit Role' : 'Create Role'}</h2>
              <button onClick={() => setShowModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Role Name *</label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. SEO Manager, Chief Employee Manager"
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2}
                  placeholder="What does this role do?"
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white placeholder-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] transition-colors resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-3">Dashboard Access</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label key={perm.key}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        form.permissions.includes(perm.key)
                          ? 'border-[#86d6c8]/30 bg-[#86d6c8]/5'
                          : 'border-white/[.06] bg-white/[.03] hover:border-white/[.12]'
                      }`}>
                      <input type="checkbox" checked={form.permissions.includes(perm.key)}
                        onChange={() => togglePermission(perm.key)}
                        className="accent-[#86d6c8] h-4 w-4" />
                      <div>
                        <p className="text-sm text-white font-medium">{perm.label}</p>
                        <p className="text-[10px] text-[#aaa9a5]">{perm.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Cancel</button>
              <button onClick={handleSave} disabled={saving || !form.name.trim()}
                className="flex-1 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Saving...' : editingId ? 'Update Role' : 'Create Role'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RolesManagement;
