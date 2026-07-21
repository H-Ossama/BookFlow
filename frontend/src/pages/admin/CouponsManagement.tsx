import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import {
  Plus, Pencil, Trash2, X, Tag, DollarSign, Calendar, Percent,
  Check, ToggleLeft, ToggleRight
} from 'lucide-react';

interface Coupon {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt: string | null;
  isActive: boolean;
  applicablePlans: string[];
  createdAt: string;
}

function CouponModal({ coupon, onClose, onSave }: { coupon: Coupon | null; onClose: () => void; onSave: (d: any) => Promise<void> }) {
  const [code, setCode] = useState(coupon?.code || '');
  const [description, setDescription] = useState(coupon?.description || '');
  const [discountPercent, setDiscountPercent] = useState(coupon?.discountPercent ?? 10);
  const [maxUses, setMaxUses] = useState(coupon?.maxUses?.toString() || '');
  const [expiresAt, setExpiresAt] = useState(coupon?.expiresAt ? coupon.expiresAt.split('T')[0] : '');
  const [applicablePlans, setApplicablePlans] = useState<string[]>(coupon?.applicablePlans || []);
  const [saving, setSaving] = useState(false);

  const allPlans = ['FREE', 'BASIC', 'PREMIUM'];
  const togglePlan = (plan: string) => {
    setApplicablePlans(prev => prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        code,
        description: description || undefined,
        discountPercent,
        maxUses: maxUses ? Number(maxUses) : undefined,
        expiresAt: expiresAt || undefined,
        applicablePlans,
      });
      onClose();
    } catch { } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/[.08] rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-serif font-bold text-lg">{coupon ? 'Edit Coupon' : 'Add Coupon'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa9a5] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Code</label>
              <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} required minLength={3} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50 uppercase" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Discount %</label>
              <input type="number" min={1} max={100} value={discountPercent} onChange={e => setDiscountPercent(Number(e.target.value))} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Max Uses</label>
              <input type="number" min={1} value={maxUses} onChange={e => setMaxUses(e.target.value)} placeholder="Unlimited" className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Expires</label>
              <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-2">Applicable Plans</label>
            <div className="flex gap-2 flex-wrap">
              {allPlans.map(plan => (
                <button key={plan} type="button" onClick={() => togglePlan(plan)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${applicablePlans.includes(plan) || applicablePlans.length === 0
                    ? 'bg-[#86d6c8] text-[#050505]' : 'bg-white/[.06] text-[#aaa9a5] hover:text-white'}`}>
                  {plan}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-[#aaa9a5] mt-1">All selected = applies to all plans</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[#aaa9a5] text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] disabled:opacity-50">{saving ? 'Saving...' : coupon ? 'Save Changes' : 'Add Coupon'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function CouponsManagement() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<{ coupon?: Coupon | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await adminApi.getCoupons();
      setCoupons(data);
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = async (data: any) => {
    if (modal?.coupon) await adminApi.updateCoupon(modal.coupon.id, data);
    else await adminApi.createCoupon(data);
    await fetchData();
  };

  const handleToggleActive = async (coupon: Coupon) => {
    await adminApi.updateCoupon(coupon.id, { isActive: !coupon.isActive });
    await fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await adminApi.deleteCoupon(deleteTarget); await fetchData(); } catch { } finally { setDeleteTarget(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  const activeCount = coupons.filter(c => c.isActive).length;

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Platform Coupons</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">Manage promotional coupons that apply across all businesses</p>
        </div>
        <button onClick={() => setModal({ coupon: null })}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all">
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Tag className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Total</span>
          </div>
          <p className="text-2xl font-bold text-white">{coupons.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">coupons created</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Check className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Active</span>
          </div>
          <p className="text-2xl font-bold text-white">{activeCount}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">currently active</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dce772]/10 flex items-center justify-center"><Percent className="h-4 w-4 text-[#dce772]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#dce772] font-semibold">Avg Discount</span>
          </div>
          <p className="text-2xl font-bold text-white">{coupons.length > 0 ? Math.round(coupons.reduce((s, c) => s + c.discountPercent, 0) / coupons.length) : 0}%</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">average discount rate</p>
        </div>
      </div>

      <div className="glass-card rounded-xl overflow-x-auto">
        {coupons.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-4">
            <Tag className="h-12 w-12 text-[#aaa9a5] mb-3" />
            <p className="text-white text-sm font-medium">No platform coupons yet</p>
            <p className="text-[#aaa9a5] text-xs mt-1 mb-4">Create coupons that apply across all businesses on the platform</p>
            <button onClick={() => setModal({ coupon: null })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all">
              <Plus className="h-4 w-4" /> Create First Coupon
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="text-left border-b border-white/[.08]">
                  <th className="pb-3 px-6 text-xs font-semibold text-[#aaa9a5]">Code</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-[#aaa9a5]">Discount</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-[#aaa9a5]">Usage</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-[#aaa9a5]">Plans</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-[#aaa9a5]">Expires</th>
                  <th className="pb-3 pr-4 text-xs font-semibold text-[#aaa9a5]">Status</th>
                  <th className="pb-3 pr-6 text-xs font-semibold text-[#aaa9a5]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(coupon => (
                  <tr key={coupon.id} className="border-b border-white/[.06] last:border-0 hover:bg-white/[.02] transition-colors">
                    <td className="py-3.5 px-6">
                        <span className="text-white text-xs font-mono font-semibold">{coupon.code}</span>
                        {coupon.description && <p className="text-[#aaa9a5] text-[10px] mt-0.5">{coupon.description}</p>}
                      </td>
                      <td className="py-3.5">
                        <span className="text-[#86d6c8] text-xs font-semibold">{coupon.discountPercent}%</span>
                      </td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">{coupon.currentUses}{coupon.maxUses ? ` / ${coupon.maxUses}` : ''}</td>
                      <td className="py-3.5">
                        <div className="flex gap-1">
                          {coupon.applicablePlans.length === 0
                            ? <span className="text-[10px] text-[#aaa9a5]">All</span>
                            : coupon.applicablePlans.map(p => (
                              <span key={p} className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-white/[.06] text-[#aaa9a5]">{p}</span>
                            ))}
                        </div>
                      </td>
                      <td className="py-3.5 text-[#aaa9a5] text-xs">
                        {coupon.expiresAt ? (
                          <span className={new Date(coupon.expiresAt) < new Date() ? 'text-red-400' : ''}>
                            {new Date(coupon.expiresAt).toLocaleDateString()}
                          </span>
                        ) : '—'}
                      </td>
                      <td className="py-3.5">
                        <button onClick={() => handleToggleActive(coupon)}
                          className={`flex items-center gap-1 text-[10px] font-semibold transition-colors cursor-pointer ${coupon.isActive ? 'text-green-400 hover:text-yellow-400' : 'text-red-400 hover:text-green-400'}`}>
                          {coupon.isActive ? <ToggleRight className="h-3.5 w-3.5" /> : <ToggleLeft className="h-3.5 w-3.5" />}
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setModal({ coupon })}
                            className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors" title="Edit">
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button onClick={() => setDeleteTarget(coupon.id)}
                            className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
          </>
        )}
      </div>

      {modal !== null && <CouponModal coupon={modal.coupon} onClose={() => setModal(null)} onSave={handleSave} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#1a1a1a] border border-white/[.08] rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-serif font-bold text-lg mb-2">Confirm Delete</h2>
            <p className="text-[#aaa9a5] text-sm mb-4">Delete this coupon? This cannot be undone.</p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-[#aaa9a5] text-sm hover:text-white">Cancel</button>
              <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-semibold hover:bg-red-500/30">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CouponsManagement;
