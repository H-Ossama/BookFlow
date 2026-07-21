import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { subscriptionApi } from '../../api/subscription.api';
import type { CurrentPlan } from '../../types/subscription.types';
import toast from 'react-hot-toast';
import { Check, Crown, Star, Zap, TrendingUp } from 'lucide-react';

const PLANS_META = [
  { id: 'FREE', name: 'Free', icon: Zap, color: '#aaa9a5', price: 0, desc: 'For small teams getting started' },
  { id: 'BASIC', name: 'Basic', icon: Star, color: '#7eb8da', price: 29, desc: 'For growing businesses' },
  { id: 'PREMIUM', name: 'Premium', icon: Crown, color: '#efc493', price: 99, desc: 'For established companies' },
];

const FEATURES = {
  FREE: ['Up to 5 bookings/month', 'Up to 2 employees', 'Basic booking management', 'Email notifications'],
  BASIC: ['Up to 50 bookings/month', 'Up to 10 employees', 'Analytics dashboard', 'Coupon codes', 'CSV exports'],
  PREMIUM: ['Unlimited bookings', 'Unlimited employees', 'Stripe payments', 'Advanced analytics', 'Priority support', 'API access'],
};

export function SubscriptionPage() {
  const { user } = useAuthContext();
  const [current, setCurrent] = useState<CurrentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const companyId = user?.companyId;

  useEffect(() => {
    if (!companyId) return;
    subscriptionApi.getCurrent(companyId).then(setCurrent).catch(() => {}).finally(() => setLoading(false));
  }, [companyId]);

  const handleChange = async (planId: string) => {
    if (!companyId || planId === current?.plan) return;
    setChanging(true);
    try {
      await subscriptionApi.changePlan(companyId, planId);
      const updated = await subscriptionApi.getCurrent(companyId);
      setCurrent(updated);
      toast.success(`Switched to ${planId}`);
    } catch {
      toast.error('Failed to change plan');
    } finally {
      setChanging(false);
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
      <div>
        <h1 className="text-2xl font-bold text-white font-serif tracking-tight">Subscription</h1>
        <p className="text-[#aaa9a5] mt-1 text-sm">Manage your plan and billing</p>
      </div>

      {current && (
        <div className="glass-card rounded-xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1">Current Plan</p>
              <p className="text-xl font-bold text-white">{current.name}</p>
              <p className="text-sm text-[#aaa9a5]">${current.price}/mo</p>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1">Bookings</p>
              <p className="text-xl font-bold text-white">{current.currentMonthBookings} / {current.monthlyBookings === 9999 ? '∞' : current.monthlyBookings}</p>
              <div className="w-full h-2 bg-white/[.06] rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#86d6c8] to-[#dce772] rounded-full transition-all" style={{ width: `${Math.min(current.usagePercent, 100)}%` }} />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[.1em] text-[#86d6c8] mb-1">Employees</p>
              <p className="text-xl font-bold text-white">{current.employeeCount} / {current.employees === 9999 ? '∞' : current.employees}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS_META.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = current?.plan === plan.id;
          const features = FEATURES[plan.id as keyof typeof FEATURES];
          return (
            <div key={plan.id} className={`glass-card rounded-xl p-6 flex flex-col ${isCurrent ? 'border-[#86d6c8] ring-1 ring-[#86d6c8]' : ''}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${isCurrent ? 'bg-[#86d6c8]/10' : 'bg-white/[.06]'} flex items-center justify-center`}>
                  <Icon className="h-5 w-5" style={{ color: plan.color }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-serif tracking-tight">{plan.name}</h3>
                  <p className="text-xs text-[#aaa9a5]">{plan.desc}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-4">${plan.price}<span className="text-sm text-[#aaa9a5] font-normal">/mo</span></p>
              <div className="space-y-2 flex-1">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-[#d4d4cf]">
                    <Check className="h-4 w-4 text-[#86d6c8] shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => handleChange(plan.id)} disabled={isCurrent || changing}
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                  isCurrent ? 'bg-[#86d6c8]/10 text-[#86d6c8]' :
                  plan.id === 'PREMIUM' ? 'bg-[#efc493] text-[#050505] hover:bg-[#f5d4a8]' :
                  'border border-white/[.08] text-[#aaa9a5] hover:text-white hover:bg-white/[.06]'
                }`}>
                {isCurrent ? 'Current Plan' : changing ? 'Updating...' : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SubscriptionPage;
