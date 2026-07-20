import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { companiesApi } from '../../api/companies.api';
import type { Company } from '../../types/company.types';
import toast from 'react-hot-toast';

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
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Company Settings</h1>
        <p className="text-gray-400 mt-1">Manage your business profile information</p>
      </div>

      <div className="bg-[#121620] border border-white/5 rounded-xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Company Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Slug</label>
            <input
              value={company?.slug || ''}
              disabled
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/20 py-3 px-4 text-sm text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-gray-500">Slug cannot be changed</p>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Phone</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Address</label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#c5a880] transition-colors"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-xs text-gray-500">
            Plan: <span className="text-[#c5a880] font-medium">{company?.subscriptionPlan}</span>
            {company?.isActive === false && <span className="text-red-400 ml-2">(Suspended)</span>}
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="relative flex items-center rounded-lg bg-[#c5a880] py-2.5 px-6 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] focus:outline-none transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage;
