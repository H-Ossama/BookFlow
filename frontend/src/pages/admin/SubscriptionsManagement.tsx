import { useState, useEffect } from 'react';
import { adminApi } from '../../api/admin.api';
import {
  Plus, Pencil, Trash2, X, Check, CreditCard, Crown,
  TrendingUp, Zap, Building2, Users, Calendar, DollarSign, Layers
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  monthlyBookings: number;
  employees: number;
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

interface Feature {
  id: string;
  name: string;
  description: string | null;
  key: string;
  category: string;
}

function FeatureModal({ feature, onClose, onSave }: { feature: Feature | null; onClose: () => void; onSave: (d: any) => Promise<void> }) {
  const [name, setName] = useState(feature?.name || '');
  const [key, setKey] = useState(feature?.key || '');
  const [description, setDescription] = useState(feature?.description || '');
  const [category, setCategory] = useState(feature?.category || 'general');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try { await onSave({ name, key: key.toLowerCase().replace(/\s+/g, '-'), description: description || undefined, category }); onClose(); }
    catch { } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/[.08] rounded-xl p-6 w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-serif font-bold text-lg">{feature ? 'Edit Feature' : 'Add Feature'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa9a5] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Key</label>
            <input value={key} onChange={e => setKey(e.target.value)} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50 font-mono text-xs" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Category</label>
            <input value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[#aaa9a5] text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] disabled:opacity-50">{saving ? 'Saving...' : feature ? 'Save' : 'Add'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function PlanModal({ plan, features, onClose, onSave }: { plan: Plan | null; features: Feature[]; onClose: () => void; onSave: (d: any) => Promise<void> }) {
  const [name, setName] = useState(plan?.name || '');
  const [description, setDescription] = useState(plan?.description || '');
  const [price, setPrice] = useState(plan?.price ?? 0);
  const [monthlyBookings, setMonthlyBookings] = useState(plan?.monthlyBookings ?? 50);
  const [employees, setEmployees] = useState(plan?.employees ?? 10);
  const [activeFeatures, setActiveFeatures] = useState<string[]>(plan?.features || []);
  const [saving, setSaving] = useState(false);

  const toggle = (key: string) => {
    setActiveFeatures(prev => prev.includes(key) ? prev.filter(f => f !== key) : [...prev, key]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ name, description: description || undefined, price, monthlyBookings, employees, features: activeFeatures });
      onClose();
    } catch { } finally { setSaving(false); }
  };

  const grouped = features.reduce<Record<string, Feature[]>>((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-[#1a1a1a] border border-white/[.08] rounded-xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-serif font-bold text-lg">{plan ? 'Edit Plan' : 'Add Plan'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg text-[#aaa9a5] hover:text-white"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Name</label>
            <input value={name} onChange={e => setName(e.target.value)} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Price ($)</label>
              <input type="number" min={0} step="0.01" value={price} onChange={e => setPrice(Number(e.target.value))} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Bookings</label>
              <input type="number" min={1} value={monthlyBookings} onChange={e => setMonthlyBookings(Number(e.target.value))} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-1">Employees</label>
              <input type="number" min={1} value={employees} onChange={e => setEmployees(Number(e.target.value))} required className="w-full bg-white/[.06] border border-white/[.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#86d6c8]/50" />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-2">Features</label>
            {Object.entries(grouped).map(([cat, feats]) => (
              <div key={cat} className="mb-3">
                <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1.5">{cat}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {feats.map(f => {
                    const enabled = activeFeatures.includes(f.key);
                    return (
                      <label key={f.id} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer transition-colors ${enabled ? 'bg-[#86d6c8]/10 border border-[#86d6c8]/30' : 'bg-white/[.04] border border-transparent hover:bg-white/[.06]'}`}>
                        <input type="checkbox" checked={enabled} onChange={() => toggle(f.key)} className="sr-only" />
                        <div className={`w-3.5 h-3.5 rounded flex items-center justify-center transition-colors ${enabled ? 'bg-[#86d6c8]' : 'bg-white/[.08]'}`}>
                          {enabled && <Check className="h-2.5 w-2.5 text-[#050505]" />}
                        </div>
                        <span className={`text-xs ${enabled ? 'text-white' : 'text-[#aaa9a5]'}`}>{f.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
            {features.length === 0 && <p className="text-[#aaa9a5] text-xs italic">No features defined yet. Add some in the Feature Library.</p>}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-[#aaa9a5] text-sm hover:text-white">Cancel</button>
            <button type="submit" disabled={saving} className="px-4 py-2 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] disabled:opacity-50">{saving ? 'Saving...' : plan ? 'Save Changes' : 'Add Plan'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function SubscriptionsManagement() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [planModal, setPlanModal] = useState<{ plan?: Plan | null } | null>(null);
  const [featureModal, setFeatureModal] = useState<{ feature?: Feature | null } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'plan' | 'feature'; id: string } | null>(null);
  const [planStats, setPlanStats] = useState<{ plan: string; count: number; revenue: number }[]>([]);

  const fetchData = async () => {
    try {
      const [plansData, featuresData, statsRes] = await Promise.all([
        adminApi.getPlans(),
        adminApi.getFeatures(),
        adminApi.getDashboard().catch(() => null),
      ]);
      setPlans(plansData);
      setFeatures(featuresData);
      if (statsRes) {
        const dist = statsRes.subscriptionDistribution || {};
        setPlanStats([
          { plan: 'FREE', count: dist.FREE || 0, revenue: 0 },
          { plan: 'BASIC', count: dist.BASIC || 0, revenue: (dist.BASIC || 0) * 29 },
          { plan: 'PREMIUM', count: dist.PREMIUM || 0, revenue: (dist.PREMIUM || 0) * 99 },
        ]);
      }
    } catch { } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSavePlan = async (data: any) => {
    if (planModal?.plan) await adminApi.updatePlan(planModal.plan.id, data);
    else await adminApi.createPlan(data);
    await fetchData();
  };

  const handleSaveFeature = async (data: any) => {
    if (featureModal?.feature) await adminApi.updateFeature(featureModal.feature.id, data);
    else await adminApi.createFeature(data);
    await fetchData();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (deleteTarget.type === 'plan') await adminApi.deletePlan(deleteTarget.id);
      else await adminApi.deleteFeature(deleteTarget.id);
      await fetchData();
    } catch { } finally { setDeleteTarget(null); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#86d6c8] border-t-transparent" />
      </div>
    );
  }

  const totalRevenue = planStats.reduce((s, p) => s + p.revenue, 0);
  const totalCompanies = planStats.reduce((s, p) => s + p.count, 0);

  const PLAN_ICONS: Record<string, any> = { FREE: Zap, BASIC: TrendingUp, PREMIUM: Crown };
  const PLAN_COLORS: Record<string, string> = {
    FREE: 'from-[#7eb8da]/20 to-[#7eb8da]/5 border-[#7eb8da]/30',
    BASIC: 'from-[#efc493]/20 to-[#efc493]/5 border-[#efc493]/30',
    PREMIUM: 'from-[#86d6c8]/20 to-[#86d6c8]/5 border-[#86d6c8]/30',
  };
  const PLAN_ACCENT: Record<string, string> = {
    FREE: '#7eb8da', BASIC: '#efc493', PREMIUM: '#86d6c8',
  };

  const groupedFeatures = features.reduce<Record<string, Feature[]>>((acc, f) => {
    if (!acc[f.category]) acc[f.category] = [];
    acc[f.category].push(f);
    return acc;
  }, {});

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Subscription Plans</h1>
          <p className="text-[#aaa9a5] text-xs mt-1">Manage plans, features, and pricing across the platform</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setPlanModal({ plan: null })}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#86d6c8] text-[#050505] text-sm font-semibold hover:bg-[#9ee0d4] transition-all">
            <Plus className="h-4 w-4" /> Add Plan
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Building2 className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Companies</span>
          </div>
          <p className="text-2xl font-bold text-white">{totalCompanies}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">total subscribers</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#dce772]/10 flex items-center justify-center"><DollarSign className="h-4 w-4 text-[#dce772]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#dce772] font-semibold">MRR</span>
          </div>
          <p className="text-2xl font-bold text-white">${totalRevenue.toFixed(2)}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">monthly recurring revenue</p>
        </div>
        <div className="glass-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#86d6c8]/10 flex items-center justify-center"><Layers className="h-4 w-4 text-[#86d6c8]" /></div>
            <span className="text-[10px] font-mono uppercase tracking-[.13em] text-[#86d6c8] font-semibold">Plans</span>
          </div>
          <p className="text-2xl font-bold text-white">{plans.length}</p>
          <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">{features.length} features defined</p>
        </div>
      </div>

      {/* Feature Library */}
      <div className="glass-card rounded-xl overflow-x-auto">
        <div className="flex items-center justify-between p-6 pb-4 min-w-max">
          <div>
            <h2 className="text-sm font-bold text-white font-serif tracking-tight">Feature Library</h2>
            <p className="text-[10px] text-[#aaa9a5] mt-0.5">Define features that can be toggled on/off per plan</p>
          </div>
          <button onClick={() => setFeatureModal({ feature: null })}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#86d6c8] text-[#050505] text-xs font-semibold hover:bg-[#9ee0d4] transition-all">
            <Plus className="h-3 w-3" /> Add Feature
          </button>
        </div>
        {features.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Layers className="h-10 w-10 text-[#aaa9a5] mb-3" />
            <p className="text-white text-sm font-medium">No features defined yet</p>
            <p className="text-[#aaa9a5] text-xs mt-1">Add features that you can assign to subscription plans</p>
          </div>
        ) : (
          <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="text-left border-b border-white/[.08]">
                  <th className="pb-3 px-6 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Name</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Key</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Category</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Used In</th>
                  <th className="pb-3 font-mono text-[10px] uppercase tracking-[.1em] text-[#aaa9a5] font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {features.map(f => {
                  const usedIn = plans.filter(p => p.features.includes(f.key)).map(p => p.name);
                  return (
                    <tr key={f.id} className="border-b border-white/[.06] last:border-0">
                      <td className="py-3 px-6">
                        <span className="text-white text-xs font-medium">{f.name}</span>
                        {f.description && <p className="text-[#aaa9a5] text-[10px] mt-0.5">{f.description}</p>}
                      </td>
                      <td className="py-3 text-[#aaa9a5] text-xs font-mono">{f.key}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-[9px] font-semibold uppercase bg-white/[.06] text-[#aaa9a5]">{f.category}</span>
                      </td>
                      <td className="py-3">
                        {usedIn.length === 0
                          ? <span className="text-[10px] text-[#aaa9a5] italic">Not used</span>
                          : <div className="flex gap-1">{usedIn.map(n => (
                            <span key={n} className="px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase bg-[#86d6c8]/10 text-[#86d6c8]">{n}</span>
                          ))}</div>
                        }
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setFeatureModal({ feature: f })} className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors" title="Edit">
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button onClick={() => setDeleteTarget({ type: 'feature', id: f.id })} className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.name] || CreditCard;
          const accent = PLAN_ACCENT[plan.name] || '#aaa9a5';
          const subscribers = planStats.find(s => s.plan === plan.name)?.count || 0;
          const mr = planStats.find(s => s.plan === plan.name)?.revenue || 0;
          const isPremium = plan.name === 'PREMIUM';
          const enabledFeatures = features.filter(f => plan.features.includes(f.key));

          return (
            <div key={plan.id} className={`glass-card rounded-xl p-6 bg-gradient-to-b ${PLAN_COLORS[plan.name] || 'from-white/[.04] to-white/[.02]'} border relative overflow-hidden ${!plan.isActive ? 'opacity-50' : ''}`}>
              {isPremium && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[8px] font-semibold uppercase tracking-[.1em] bg-[#86d6c8] text-[#050505]">Best Value</span>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[.06] flex items-center justify-center" style={{ color: accent }}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-white text-base font-bold font-serif">{plan.name}</h2>
                    {plan.description && <p className="text-[10px] text-[#aaa9a5] mt-0.5">{plan.description}</p>}
                    <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] mt-0.5">
                      {subscribers} company{subscribers !== 1 ? 'ies' : 'y'} · ${mr.toFixed(0)}/mo MRR
                    </p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setPlanModal({ plan })}
                    className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors" title="Edit">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteTarget({ type: 'plan', id: plan.id })}
                    className="p-1.5 rounded-lg text-[#aaa9a5] hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold text-white">${plan.price}</span>
                <span className="text-[#aaa9a5] text-sm ml-1">/month</span>
                {!plan.isActive && <span className="ml-2 text-[10px] text-red-400 font-semibold uppercase">Inactive</span>}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white/[.06] flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-3 w-3" style={{ color: accent }} />
                  </div>
                  <span className="text-white">{plan.monthlyBookings === 9999 ? 'Unlimited' : plan.monthlyBookings.toLocaleString()} bookings/month</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-white/[.06] flex items-center justify-center flex-shrink-0">
                    <Users className="h-3 w-3" style={{ color: accent }} />
                  </div>
                  <span className="text-white">{plan.employees === 9999 ? 'Unlimited' : plan.employees} employees</span>
                </div>
                {enabledFeatures.length > 0 ? (
                  <div className="pt-2 border-t border-white/[.06]">
                    <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#aaa9a5] mb-2">Features</p>
                    <div className="space-y-1.5">
                      {enabledFeatures.map(f => (
                        <div key={f.key} className="flex items-center gap-2 text-xs">
                          <Check className="h-3 w-3 flex-shrink-0" style={{ color: accent }} />
                          <span className="text-[#aaa9a5]">{f.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-[#aaa9a5] italic">No features assigned</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {planModal !== null && <PlanModal plan={planModal.plan} features={features} onClose={() => setPlanModal(null)} onSave={handleSavePlan} />}
      {featureModal !== null && <FeatureModal feature={featureModal.feature} onClose={() => setFeatureModal(null)} onSave={handleSaveFeature} />}

      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#1a1a1a] border border-white/[.08] rounded-xl p-6 w-full max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h2 className="text-white font-serif font-bold text-lg mb-2">Confirm Delete</h2>
            <p className="text-[#aaa9a5] text-sm mb-4">Delete this {deleteTarget.type}? This cannot be undone.</p>
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

export default SubscriptionsManagement;
