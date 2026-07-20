import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { subscriptionApi } from '../../api/subscription.api';
import type { CurrentPlan } from '../../types/subscription.types';
import toast from 'react-hot-toast';
import { Check, Crown, Star, Zap } from 'lucide-react';

const PLANS_META = [
  { id: 'FREE', name: 'Free', icon: Zap, color: 'text-gray-400', price: 0, desc: 'For small teams getting started' },
  { id: 'BASIC', name: 'Basic', icon: Star, color: 'text-blue-400', price: 29, desc: 'For growing businesses' },
  { id: 'PREMIUM', name: 'Premium', icon: Crown, color: 'text-[#c5a880]', price: 99, desc: 'For established companies' },
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
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="text-gray-400 mt-1">Manage your plan and billing</p>
      </div>

      {/* Current Usage */}
      {current && (
        <div className="bg-[#121620] border border-white/5 rounded-xl p-6">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Plan</p>
              <p className="text-xl font-bold text-white">{current.name}</p>
              <p className="text-sm text-gray-400">${current.price}/mo</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Bookings</p>
              <p className="text-xl font-bold text-white">{current.currentMonthBookings} / {current.monthlyBookings === 9999 ? '∞' : current.monthlyBookings}</p>
              <div className="w-full h-2 bg-white/5 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#c5a880] rounded-full transition-all" style={{ width: `${Math.min(current.usagePercent, 100)}%` }} />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Employees</p>
              <p className="text-xl font-bold text-white">{current.employeeCount} / {current.employees === 9999 ? '∞' : current.employees}</p>
            </div>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS_META.map((plan) => {
          const Icon = plan.icon;
          const isCurrent = current?.plan === plan.id;
          const features = FEATURES[plan.id as keyof typeof FEATURES];
          return (
            <div key={plan.id} className={`bg-[#121620] border rounded-xl p-6 flex flex-col ${isCurrent ? 'border-[#c5a880] ring-1 ring-[#c5a880]' : 'border-white/5'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${isCurrent ? 'bg-[#c5a880]/10' : 'bg-white/5'} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${plan.color}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-sm text-gray-400">{plan.desc}</p>
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-4">${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
              <div className="space-y-2 flex-1">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-[#c5a880] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              <button onClick={() => handleChange(plan.id)} disabled={isCurrent || changing}
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                  isCurrent ? 'bg-[#c5a880]/10 text-[#c5a880]' :
                  plan.id === 'PREMIUM' ? 'bg-[#c5a880] text-[#0a0c10] hover:bg-[#d6ba93]' :
                  'border border-white/5 text-gray-300 hover:bg-white/5'
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
