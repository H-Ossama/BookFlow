import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { couponsApi, type Coupon } from '../../api/coupons.api';
import toast from 'react-hot-toast';
import { Plus, X, Tag, Search, Percent, Calendar, Clock, CheckCircle2, XCircle, Zap, Users } from 'lucide-react';

export function CouponsManagement() {
  const { user } = useAuthContext();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', discountPercent: 10, maxUses: '' as string, expiresAt: '' });
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const companyId = user?.companyId;

  const fetchCoupons = async () => {
    if (!companyId) return;
    try {
      const data = await couponsApi.getAll(companyId);
      setCoupons(data);
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCoupons(); }, [companyId]);

  const filtered = coupons.filter((c) =>
    c.code.toLowerCase().includes(search.toLowerCase())
  );

  const activeCoupons = coupons.filter((c) => c.isActive).length;
  const totalUses = coupons.reduce((a, c) => a + c.currentUses, 0);

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
    } catch { toast.error('Failed to create coupon'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (coupon: Coupon) => {
    if (!companyId) return;
    try {
      const updated = await couponsApi.update(coupon.id, companyId, { isActive: !coupon.isActive });
      setCoupons((prev) => prev.map((c) => (c.id === coupon.id ? updated : c)));
      toast.success(updated.isActive ? 'Coupon activated' : 'Coupon deactivated');
    } catch { toast.error('Failed to update coupon'); }
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
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Coupons</h1>
          <p className="text-[#aaa9a5] mt-1 text-sm">Manage promotional codes and discounts</p>
        </div>
        <button onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg bg-[#86d6c8] py-2.5 px-5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all cursor-pointer">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{coupons.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Total Coupons</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{activeCoupons}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mt-1">Active</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{totalUses}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#efc493] mt-1">Total Uses</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <p className="text-2xl font-bold text-white">{coupons.filter((c) => c.expiresAt && new Date(c.expiresAt) < new Date()).length}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mt-1">Expired</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 glass-card rounded-lg">
        <Search className="h-4 w-4 text-[#aaa9a5]" />
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by coupon code..."
          className="flex-1 bg-transparent border-0 outline-0 text-white text-sm placeholder-[#aaa9a5]" />
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-card rounded-xl">
          <Tag className="h-10 w-10 text-[#aaa9a5] mb-4" />
          <p className="text-white text-sm font-medium">{search ? 'No coupons match your search' : 'No coupons yet'}</p>
          <p className="text-[#aaa9a5] text-xs mt-1">{search ? 'Try a different search term' : 'Create your first promo code to get started'}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
            const isExpired = c.expiresAt && new Date(c.expiresAt) < new Date();
            return (
              <div key={c.id} className="glass-card rounded-xl p-5 hover:border-white/[.14] transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#86d6c8]/20 to-[#dce772]/20 flex items-center justify-center">
                      <Percent className="h-5 w-5 text-[#dce772]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-white font-mono font-bold text-sm tracking-wider">{c.code}</span>
                        <span className="px-2 py-0.5 rounded-full bg-[#dce772]/10 text-[#dce772] text-[10px] font-semibold font-mono">{c.discountPercent}% OFF</span>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-[.08em] px-2 py-0.5 rounded-full ${
                          isExpired ? 'text-[#aaa9a5] bg-white/[.06]' :
                          c.isActive ? 'text-[#86d6c8] bg-[#86d6c8]/10' : 'text-[#aaa9a5] bg-white/[.06]'
                        }`}>
                          {isExpired ? <XCircle className="h-2.5 w-2.5" /> : c.isActive ? <CheckCircle2 className="h-2.5 w-2.5" /> : <XCircle className="h-2.5 w-2.5" />}
                          {isExpired ? 'Expired' : c.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#aaa9a5] mt-1 flex-wrap">
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {c.currentUses}{c.maxUses ? ` / ${c.maxUses}` : ''} uses</span>
                        {c.expiresAt && (
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> Expires {new Date(c.expiresAt).toLocaleDateString()}</span>
                        )}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Created {new Date(c.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => toggleActive(c)} disabled={isExpired}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-[.08em] transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${
                      c.isActive && !isExpired ? 'text-[#86d6c8] bg-[#86d6c8]/10 hover:bg-[#86d6c8]/20' : 'text-[#aaa9a5] bg-white/[.06] hover:bg-white/[.1]'
                    }`}>
                    {isExpired ? 'Expired' : c.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md glass-card rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-white font-serif tracking-tight">Create Coupon</h2>
              <button onClick={() => setShowModal(false)} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Code</label>
                <div className="relative">
                  <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                    className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white font-mono focus:outline-none focus:border-[#86d6c8] uppercase tracking-wider"
                    placeholder="SUMMER20" />
                  <Tag className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#aaa9a5]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Discount %</label>
                <input type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: parseInt(e.target.value) || 0 })} min={1} max={100}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Max Uses</label>
                <input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8]"
                  placeholder="Leave empty for unlimited" />
              </div>
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">Expires At</label>
                <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                  className="block w-full rounded-lg border border-white/[.08] bg-white/[.06] py-2.5 px-3.5 text-sm text-white focus:outline-none focus:border-[#86d6c8]" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="flex-1 rounded-lg border border-white/[.08] py-2.5 text-sm text-[#aaa9a5] hover:bg-white/[.06] transition-all cursor-pointer">Cancel</button>
              <button onClick={handleCreate} disabled={saving || !form.code || form.discountPercent < 1}
                className="flex-1 rounded-lg bg-[#86d6c8] py-2.5 text-sm font-semibold text-[#050505] hover:bg-[#9ee0d4] transition-all disabled:opacity-50 cursor-pointer">
                {saving ? 'Creating...' : 'Create Coupon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponsManagement;
