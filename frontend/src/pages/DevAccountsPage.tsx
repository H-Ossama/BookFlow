import { Link } from 'react-router-dom';
import { Copy, Check, ArrowLeft, Eye, EyeOff, Shield, User, Briefcase, HardHat, Search, X } from 'lucide-react';
import { useState, useMemo } from 'react';

const accounts = [
  // ── SUPER ADMIN ──
  { group: 'Platform', role: 'SUPER_ADMIN', label: 'Super Admin', email: 'admin@bookflow.com', icon: Shield, color: '#efc493' },

  // ── COMPANY ADMINS (Managers) ──
  { group: 'Managers', role: 'COMPANY_ADMIN', label: 'Luxe Salon & Spa', email: 'manager@luxesalon.com', icon: Briefcase, color: '#86d6c8' },
  { group: 'Managers', role: 'COMPANY_ADMIN', label: 'FitForge Gym', email: 'manager@fitforge.com', icon: Briefcase, color: '#86d6c8' },
  { group: 'Managers', role: 'COMPANY_ADMIN', label: 'Paws & Claws', email: 'manager@pawsandclaws.com', icon: Briefcase, color: '#86d6c8' },

  // ── LUXE SALON EMPLOYEES ──
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'Emma Chen — Manager', email: 'emma@luxesalon.com', icon: HardHat, color: '#e8a0b4' },
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'James Rivera — Senior Staff', email: 'james@luxesalon.com', icon: HardHat, color: '#7eb8da' },
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'Mia Williams — Staff', email: 'mia@luxesalon.com', icon: HardHat, color: '#c5a880' },
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'Liam Brown — Staff', email: 'liam@luxesalon.com', icon: HardHat, color: '#aaa9a5' },
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'Olivia Davis — Senior Staff', email: 'olivia@luxesalon.com', icon: HardHat, color: '#7eb8da' },
  { group: 'Luxe Salon & Spa', role: 'EMPLOYEE', label: 'Noah Wilson — Staff', email: 'noah@luxesalon.com', icon: HardHat, color: '#c5a880' },

  // ── FITFORGE EMPLOYEES ──
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: 'Jake Thompson — Manager', email: 'jake@fitforge.com', icon: HardHat, color: '#e8a0b4' },
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: 'Elena Rodriguez — Senior Staff', email: 'elena@fitforge.com', icon: HardHat, color: '#7eb8da' },
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: 'Marcus Lee — Staff', email: 'marcusl@fitforge.com', icon: HardHat, color: '#c5a880' },
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: 'Aisha Patel — Staff', email: 'aisha@fitforge.com', icon: HardHat, color: '#aaa9a5' },
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: "Connor O'Brien — Senior Staff", email: 'connor@fitforge.com', icon: HardHat, color: '#7eb8da' },
  { group: 'FitForge Gym', role: 'EMPLOYEE', label: 'Zara Kim — Staff', email: 'zara@fitforge.com', icon: HardHat, color: '#c5a880' },

  // ── PAWS & CLAWS EMPLOYEES ──
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Sophie Martin — Manager', email: 'sophie@pawsandclaws.com', icon: HardHat, color: '#e8a0b4' },
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Tom Baker — Senior Staff', email: 'tom@pawsandclaws.com', icon: HardHat, color: '#7eb8da' },
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Lily Chen — Staff', email: 'lilyc@pawsandclaws.com', icon: HardHat, color: '#c5a880' },
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Max Turner — Staff', email: 'max@pawsandclaws.com', icon: HardHat, color: '#aaa9a5' },
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Ruby Santos — Senior Staff', email: 'ruby@pawsandclaws.com', icon: HardHat, color: '#7eb8da' },
  { group: 'Paws & Claws', role: 'EMPLOYEE', label: 'Oscar Ford — Staff', email: 'oscar@pawsandclaws.com', icon: HardHat, color: '#c5a880' },

  // ── CUSTOMERS ──
  { group: 'Customers', role: 'CUSTOMER', label: 'Alex Martinez', email: 'alex@test.com', icon: User, color: '#c5a880' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Sam Taylor', email: 'sam@test.com', icon: User, color: '#86d6c8' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Jordan Lee', email: 'jordan@test.com', icon: User, color: '#7eb8da' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Casey Kim', email: 'casey@test.com', icon: User, color: '#e8a0b4' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Riley Brown', email: 'riley@test.com', icon: User, color: '#efc493' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Morgan White', email: 'morgan@test.com', icon: User, color: '#ff6b6b' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Jamie Garcia', email: 'jamie@test.com', icon: User, color: '#51cf66' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Taylor Reed', email: 'taylor@test.com', icon: User, color: '#845ef7' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Quinn Cooper', email: 'quinn@test.com', icon: User, color: '#20c997' },
  { group: 'Customers', role: 'CUSTOMER', label: 'Dakota Evans', email: 'dakota@test.com', icon: User, color: '#ff922b' },
];

const PASSWORD = import.meta.env.VITE_DEV_PASSWORD || '';

export function DevAccountsPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [groupFilter, setGroupFilter] = useState('all');

  if (!PASSWORD) return null;

  const uniqueGroups = useMemo(() => Array.from(new Set(accounts.map((a) => a.group))), []);
  const uniqueRoles = useMemo(() => Array.from(new Set(accounts.map((a) => a.role))), []);

  const visible = useMemo(() => {
    const q = search.toLowerCase();
    return accounts.filter((a) => {
      if (roleFilter !== 'all' && a.role !== roleFilter) return false;
      if (groupFilter !== 'all' && a.group !== groupFilter) return false;
      if (!q) return true;
      return a.label.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.group.toLowerCase().includes(q) || a.role.toLowerCase().includes(q);
    });
  }, [search, roleFilter, groupFilter]);

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const clearFilters = () => { setSearch(''); setRoleFilter('all'); setGroupFilter('all'); };
  const hasActiveFilters = search || roleFilter !== 'all' || groupFilter !== 'all';

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-[#aaa9a5] hover:text-white transition-colors">
            <ArrowLeft size={15} /> Back to home
          </Link>
          <span className="font-mono text-[10px] uppercase tracking-[.13em] text-[#86d6c8]">Development Only</span>
        </div>

        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight leading-none">
            Dev <em className="not-italic text-[#efc493]">Accounts</em>
          </h1>
          <p className="text-sm text-[#aaa9a5] leading-relaxed">
            {accounts.length} pre-seeded accounts across all companies. All share the same password.
          </p>
        </div>

        {/* ── SEARCH & FILTERS ── */}
        <div className="bg-[#0a0c10] border border-white/[.08] rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3 px-3 py-2 bg-white/[.03] border border-white/[.06] rounded-lg">
            <Search size={14} className="text-[#aaa9a5] shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, group, or role..."
              className="flex-1 bg-transparent border-0 outline-0 text-sm text-white placeholder-[#aaa9a5]" />
            {search && <button onClick={() => setSearch('')} className="text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"><X size={14} /></button>}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}
              className="text-[11px] font-mono uppercase tracking-[.08em] bg-white/[.03] border border-white/[.06] rounded-lg px-3 py-1.5 text-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] cursor-pointer">
              <option value="all">All Roles</option>
              {uniqueRoles.map((r) => (
                <option key={r} value={r} className="bg-[#0a0c10]">{r.replace('_', ' ')}</option>
              ))}
            </select>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)}
              className="text-[11px] font-mono uppercase tracking-[.08em] bg-white/[.03] border border-white/[.06] rounded-lg px-3 py-1.5 text-[#aaa9a5] focus:outline-none focus:border-[#86d6c8] cursor-pointer">
              <option value="all">All Groups</option>
              {uniqueGroups.map((g) => (
                <option key={g} value={g} className="bg-[#0a0c10]">{g}</option>
              ))}
            </select>
            {hasActiveFilters && (
              <button onClick={clearFilters}
                className="text-[11px] font-mono uppercase tracking-[.08em] text-[#efc493] hover:text-[#f5d4a7] transition-colors px-2 cursor-pointer">
                Clear
              </button>
            )}
            <span className="ml-auto text-[10px] font-mono text-[#aaa9a5]">{visible.length} / {accounts.length}</span>
          </div>
        </div>

        <div className="bg-[#0a0c10] border border-white/[.08] rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/[.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#c5a880]/10">
                <Shield size={13} className="text-[#c5a880]" />
              </span>
              <span className="text-sm font-medium">Shared Password</span>
            </div>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center gap-1.5 text-xs text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="px-5 pb-5 pt-4">
            <div className="flex items-center justify-between bg-white/[.03] border border-white/[.06] rounded-lg px-4 py-3 font-mono text-sm">
              <span className={showPassword ? 'text-white' : 'text-transparent select-none bg-white/[.04] rounded'}>
                {showPassword ? PASSWORD : '\u2022'.repeat(PASSWORD.length)}
              </span>
              <button
                onClick={() => copyToClipboard(PASSWORD, 'password')}
                className="flex items-center gap-1.5 text-xs text-[#aaa9a5] hover:text-white transition-colors cursor-pointer"
              >
                {copied === 'password' ? <Check size={13} className="text-[#86d6c8]" /> : <Copy size={13} />}
                {copied === 'password' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {visible.length === 0 ? (
          <div className="bg-[#0a0c10] border border-white/[.08] rounded-xl p-10 text-center">
            <p className="text-sm text-[#aaa9a5]">No accounts match your filters</p>
            <button onClick={clearFilters} className="mt-2 text-xs text-[#efc493] hover:text-[#f5d4a7] transition-colors cursor-pointer">Clear filters</button>
          </div>
        ) : (
          Array.from(new Set(visible.map((a) => a.group))).map((group) => (
            <div key={group} className="space-y-2">
              {!search && (
                <div className="flex items-center gap-2 pt-2 pb-1">
                  <span className="h-px flex-1 bg-white/[.06]" />
                  <span className="font-mono text-[10px] uppercase tracking-[.13em] text-[#aaa9a5]">{group}</span>
                  <span className="h-px flex-1 bg-white/[.06]" />
                </div>
              )}
              {visible.filter((a) => a.group === group).map((account) => {
                const key = account.email;
                const Icon = account.icon;
                return (
                  <div
                    key={key}
                    className="bg-[#0a0c10] border border-white/[.08] rounded-xl p-5 flex items-center gap-4 hover:border-white/[.14] transition-colors"
                  >
                    <span
                      className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
                      style={{ backgroundColor: `${account.color}12` }}
                    >
                      <Icon size={17} style={{ color: account.color }} />
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-sm font-medium text-white truncate">{account.label}</span>
                        <span className="font-mono text-[10px] uppercase tracking-[.13em] px-1.5 py-0.5 rounded"
                          style={{ backgroundColor: `${account.color}18`, color: account.color }}>
                          {account.role.replace('_', ' ')}
                        </span>
                      </div>
                      <span className="text-sm text-[#aaa9a5]">{account.email}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(account.email, key)}
                      className="flex items-center gap-1.5 text-xs text-[#aaa9a5] hover:text-white transition-colors cursor-pointer shrink-0"
                    >
                      {copied === key ? <Check size={13} className="text-[#86d6c8]" /> : <Copy size={13} />}
                      {copied === key ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                );
              })}
            </div>
          ))
        )}

        <div className="bg-[#0a0c10] border border-white/[.08] rounded-xl p-5">
          <div className="flex items-start gap-3">
            <span className="text-[#efc493] text-sm leading-none mt-0.5">*</span>
            <p className="text-xs text-[#aaa9a5] leading-relaxed">
              This page is only visible in development mode. Remove before deploying to production.
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] font-mono uppercase tracking-[.13em] text-white/[.20]">
          BookFlow · Development Seed Data
        </p>
      </div>
    </div>
  );
}

export default DevAccountsPage;
