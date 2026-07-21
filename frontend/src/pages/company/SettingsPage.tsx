import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { companiesApi } from '../../api/companies.api';
import type { Company } from '../../types/company.types';
import toast from 'react-hot-toast';
import { Building2, Save } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', phone: '', email: '', address: '' });

  useEffect(() => {
    if (!user?.companyId) {
      navigate('/dashboard');
      return;
    }
    companiesApi.getById(user.companyId).then((c) => {
      setCompany(c);
      setForm({ name: c.name, description: c.description || '', phone: c.phone || '', email: c.email || '', address: c.address || '' });
      setLoading(false);
    }).catch(() => {
      toast.error('Failed to load company settings');
      setLoading(false);
    });
  }, [user, navigate]);

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    try {
      const updated = await companiesApi.update(company.id, form);
      setCompany(updated);
      toast.success('Settings saved');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
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
    <div className="max-w-3xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Company Settings</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Manage your business profile information</p>
      </div>

      <div className="glass-card rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Company Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Slug</label>
            <input value={company?.slug || ''} disabled
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.03] py-2.5 px-3.5 text-sm text-[#aaa9a5] cursor-not-allowed" />
            <p className="mt-1 text-[10px] text-[#aaa9a5]">Slug cannot be changed</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3}
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Phone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Address</label>
            <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8] transition-colors" />
          </div>
        </div>

        <div className="pt-4 border-t border-white/[.08] flex items-center justify-between">
          <div className="text-[10px] text-[#aaa9a5] font-mono">
            Plan: <span className="text-[#86d6c8] font-semibold">{company?.subscriptionPlan}</span>
            {company?.isActive === false && <span className="text-[#e8a0b4] ml-2">(Suspended)</span>}
          </div>
          <button onClick={handleSave} disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 px-6 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer">
            <Save className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
