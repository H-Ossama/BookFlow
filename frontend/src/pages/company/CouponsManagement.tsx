import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { couponsApi, type Coupon } from '../../api/coupons.api';
import toast from 'react-hot-toast';
import { Plus, X, Tag, Power } from 'lucide-react';

export function CouponsManagement() {
  const { user } = useAuthContext();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', discountPercent: 10, maxUses: '' as string, expiresAt: '' });
  const [saving, setSaving] = useState(false);
  const companyId = user?.companyId;

  const fetchCoupons = async () => {
    if (!companyId) return;
    try {
      const data = await couponsApi.getAll(companyId);
      setCoupons(data);
    } catch {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, [companyId]);

  const handleCreate = async () => {
    if (!companyId) return;
    setSaving(true);
    try {
      const coupon = await couponsApi.create(companyId, {
        code: form.code,
        discountPercent: form.discountPercent,
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      });
      setCoupons((prev) => [coupon, ...prev]);
      setShowModal(false);
      setForm({ code: '', discountPercent: 10, maxUses: '', expiresAt: '' });
      toast.success('Coupon created');
    } catch {
      toast.error('Failed to create coupon');
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (coupon: Coupon) => {
    if (!companyId) return;
    try {
      const updated = await couponsApi.update(coupon.id, companyId, { isActive: !coupon.isActive });
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
      toast.success(updated.isActive ? 'Coupon activated' : 'Coupon deactivated');
    } catch {
      toast.error('Failed to update coupon');
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <p className="text-gray-400 mt-1">Manage promotional codes</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg bg-[#c5a880] py-2.5 px-5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No coupons yet. Create your first promo code.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((c) => (
            <div key={c.id} className="bg-[#121620] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#c5a880]/10 flex items-center justify-center">
                  <Tag className="h-5 w-5 text-[#c5a880]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-mono font-bold text-sm">{c.code}</span>
                    <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 text-[10px] font-semibold">{c.discountPercent}% off</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${c.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Used {c.currentUses}{c.maxUses ? `/${c.maxUses}` : ''}{c.expiresAt ? ` · Expires ${c.expiresAt.split('T')[0]}` : ''}</p>
                </div>
              </div>
              <button onClick={() => toggleActive(c)} className="p-2 text-gray-400 hover:text-[#c5a880] transition-colors cursor-pointer" title={c.isActive ? 'Deactivate' : 'Activate'}>
                <Power className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-md bg-[#121620] border border-white/5 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Code</label>
                <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white font-mono focus:outline-none focus:border-[#c5a880] uppercase" placeholder="SUMMER20" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Discount %</label>
                <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} min={1} max={100} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Max Uses</label>
                <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880]" placeholder="Leave empty for unlimited" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#c5a880] uppercase tracking-wider mb-2">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="block w-full rounded-lg border border-white/5 bg-[#1a202c]/50 py-3 px-4 text-sm text-white focus:outline-none focus:border-[#c5a880]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/5 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleCreate} disabled={saving || !form.code || form.discountPercent < 1} className="flex-1 rounded-lg bg-[#c5a880] py-2.5 text-sm font-semibold text-[#0a0c10] hover:bg-[#d6ba93] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Creating...' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponsManagement;
