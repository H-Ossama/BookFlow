import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowUpRight, Check, Crown, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import { subscriptionApi } from '../../api/subscription.api';
import { useAuthContext } from '../../context/AuthContext';
import type { CurrentPlan, Plan } from '../../types/subscription.types';

const FALLBACK_PLANS: Plan[] = [
  {
    id: 'FREE',
    name: 'Starter',
    price: 0,
    monthlyBookings: 50,
    employees: 1,
    features: ['Client self-booking page', 'Calendar overview', 'Email confirmations', 'Basic customer records'],
  },
  {
    id: 'BASIC',
    name: 'Studio',
    price: 19,
    monthlyBookings: 300,
    employees: 5,
    features: ['Team scheduling', 'Payments tracking', 'Customer history', 'Availability rules', 'Priority reminders'],
  },
  {
    id: 'PREMIUM',
    name: 'Growth',
    price: 49,
    monthlyBookings: 9999,
    employees: 9999,
    features: ['Unlimited bookings', 'Advanced insights', 'Multi-staff management', 'VIP support', 'Revenue reports'],
  },
];

const PLAN_ICONS: Record<string, typeof Zap> = { FREE: Zap, BASIC: Star, PREMIUM: Crown };

function formatLimit(value: number, label: string) {
  return value === 9999 ? `Unlimited ${label}` : `${value.toLocaleString()} ${label}`;
}

export function PricingPage() {
  const { user } = useAuthContext();
  const [plans, setPlans] = useState<Plan[]>(FALLBACK_PLANS);
  const [currentPlan, setCurrentPlan] = useState<CurrentPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [changing, setChanging] = useState(false);
  const companyId = user?.companyId;

  useEffect(() => {
    Promise.all([
      subscriptionApi.getPlans(),
      companyId ? subscriptionApi.getCurrent(companyId) : Promise.resolve(null),
    ]).then(([p, c]) => {
      setPlans(p.length ? p : FALLBACK_PLANS);
      setCurrentPlan(c);
    }).catch(() => {
      setPlans(FALLBACK_PLANS);
    }).finally(() => setLoading(false));
  }, [companyId]);

  const handleChange = async (planId: string) => {
    if (!companyId) return;
    if (planId === currentPlan?.plan) return;
    setChanging(true);
    try {
      await subscriptionApi.changePlan(companyId, planId);
      const updated = await subscriptionApi.getCurrent(companyId);
      setCurrentPlan(updated);
      toast.success(`Changed to ${planId}`);
    } catch {
      toast.error('Failed to change plan');
    } finally {
      setChanging(false);
    }
  };

  return (
    <main className="bf-pricing-page">
      <section className="bf-pricing-hero">
        <div>
          <span className="bf-page-kicker"><Sparkles size={14} /> Pricing for busy calendars</span>
          <h1>Simple plans for teams that live by the clock.</h1>
          <p>Start with the essentials, then unlock deeper scheduling, team, and revenue controls as your bookings grow.</p>
        </div>
        <aside className="bf-plan-snapshot">
          <ShieldCheck size={19} />
          <span>Included on every plan</span>
          <b>Booking page, calendar view, customer records, and clean daily reporting.</b>
        </aside>
      </section>

      {currentPlan && (
        <section className="bf-current-plan">
          <div>
            <span>Current workspace plan</span>
            <h2>{currentPlan.name}</h2>
          </div>
          <div>
            <span>This month</span>
            <b>{currentPlan.currentMonthBookings} / {currentPlan.monthlyBookings} bookings</b>
            <div className="bf-progress"><i style={{ width: `${Math.min(currentPlan.usagePercent, 100)}%` }} /></div>
          </div>
        </section>
      )}

      <section className="bf-plan-grid" aria-busy={loading}>
        {plans.map((plan) => {
          const Icon = PLAN_ICONS[plan.id] || Zap;
          const isCurrent = currentPlan?.plan === plan.id;
          const isFeatured = plan.id === 'BASIC';
          return (
            <article className={`bf-plan-card ${isFeatured ? 'featured' : ''}`} key={plan.id}>
              <div className="bf-plan-top">
                <Icon size={21} />
                <span>{isCurrent ? 'ACTIVE' : isFeatured ? 'MOST POPULAR' : 'PLAN'}</span>
              </div>
              <h2>{plan.name}</h2>
              <p className="bf-price">${plan.price}<small>/month</small></p>
              <p className="bf-plan-copy">{formatLimit(plan.monthlyBookings, 'bookings')} and {formatLimit(plan.employees, 'team members')}.</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}><Check size={15} /> {feature}</li>
                ))}
              </ul>
              {companyId ? (
                <button type="button" onClick={() => handleChange(plan.id)} disabled={isCurrent || changing}>
                  {isCurrent ? 'Current plan' : changing ? 'Changing...' : `Switch to ${plan.name}`}
                </button>
              ) : (
                <Link to="/register">
                  Start with {plan.name} <ArrowUpRight size={15} />
                </Link>
              )}
            </article>
          );
        })}
      </section>

      <section className="bf-pricing-note">
        <span>Need a booking page today?</span>
        <p>Launch free, invite your team when you are ready, and keep every client appointment in one calm workspace.</p>
        <Link to="/register">Get started for free <ArrowUpRight size={15} /></Link>
      </section>
    </main>
  );
}

export default PricingPage;
