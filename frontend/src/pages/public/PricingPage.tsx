import { useState, useEffect } from 'react';
import { subscriptionApi } from '../../api/subscription.api';
import { useAuthContext } from '../../context/AuthContext';
import type { Plan, CurrentPlan } from '../../types/subscription.types';
import toast from 'react-hot-toast';
import { Check, Zap, Star, Crown } from 'lucide-react';

const PLAN_ICONS: Record<string, typeof Zap> = { FREE: Zap, BASIC: Star, PREMIUM: Crown };
const PLAN_COLORS: Record<string, string> = { FREE: 'text-gray-400', BASIC: 'text-blue-400', PREMIUM: 'text-[#c5a880]' };

export function PricingPage() {
  const { user } = useAuthContext();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const companyId = user?.companyId;

  useEffect(() => {
    Promise.all([
      subscriptionApi.getPlans(),
      companyId ? subscriptionApi.getCurrent(companyId) : Promise.resolve(null),
    ]).then(([p, c]) => {
      setPlans(p);
      setCurrentPlan(c);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [companyId]);

  const handleChange = async (planId: string) => {
    if (!companyId || planId === currentPlan?.plan) return;
    setChanging(true);
    try {
      await subscriptionApi.changePlan(companyId, planId);
      const updated = await subscriptionApi.getCurrent(companyId);
      setCurrentPlan(updated);
      toast.success(`Upgraded to ${planId}`);
    } catch {
      toast.error('Failed to change plan');
    } finally {
      setChanging(false);
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
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Pricing Plans</h1>
        <p className="text-gray-400 mt-2">Choose the plan that fits your business</p>
      </div>

      {/* Current Plan Card */}
      {currentPlan && (
        <div className="bg-[#121620] border border-white/5 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Current Plan</p>
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold text-white`}>{currentPlan.name}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Usage</p>
              <p className="text-lg font-bold text-white">{currentPlan.currentMonthBookings} / {currentPlan.monthlyBookings} bookings</p>
              <div className="w-32 h-2 bg-white/5 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-[#c5a880] rounded-full transition-all" style={{ width: `${Math.min(currentPlan.usagePercent, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.id] || Zap;
          const isCurrent = currentPlan?.plan === plan.id;
          return (
            <div key={plan.id} className={`bg-[#121620] border rounded-xl p-6 flex flex-col ${isCurrent ? 'border-[#c5a880] ring-1 ring-[#c5a880]' : 'border-white/5'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-lg ${isCurrent ? 'bg-[#c5a880]/10' : 'bg-white/5'} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${PLAN_COLORS[plan.id] || 'text-gray-400'}`} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  <p className="text-2xl font-bold text-white">${plan.price}<span className="text-sm text-gray-500 font-normal">/mo</span></p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Bookings</span>
                  <span className="text-white font-medium">{plan.monthlyBookings === 9999 ? 'Unlimited' : plan.monthlyBookings}/mo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Employees</span>
                  <span className="text-white font-medium">{plan.employees === 9999 ? 'Unlimited' : plan.employees}</span>
                </div>
                <div className="border-t border-white/5 my-3" />
                {plan.features.map((f: string, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="h-4 w-4 text-[#c5a880] flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleChange(plan.id)}
                disabled={isCurrent || changing}
                className={`mt-6 w-full py-2.5 rounded-lg text-sm font-semibold transition-all cursor-pointer disabled:cursor-default ${
                  isCurrent ? 'bg-[#c5a880]/10 text-[#c5a880]' :
                  plan.id === 'PREMIUM' ? 'bg-[#c5a880] text-[#0a0c10] hover:bg-[#d6ba93]' :
                  'border border-white/5 text-gray-300 hover:bg-white/5'
                }`}
              >
                {isCurrent ? 'Current Plan' : changing ? 'Upgrading...' : `Switch to ${plan.name}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PricingPage;
