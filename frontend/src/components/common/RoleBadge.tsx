interface RoleBadgeProps {
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  size?: 'sm' | 'md';
}

const ROLE_CONFIG = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    short: 'SA',
    bg: 'from-[#efc493] to-[#d4a56a]',
    border: 'border-[#efc493]/30',
  },
  COMPANY_ADMIN: {
    label: 'Manager',
    short: 'AD',
    bg: 'from-[#86d6c8] to-[#5cb8a8]',
    border: 'border-[#86d6c8]/30',
  },
  EMPLOYEE: {
    label: 'Employee',
    short: 'EM',
    bg: 'from-[#7eb8da] to-[#5a9fc4]',
    border: 'border-[#7eb8da]/30',
  },
  CUSTOMER: {
    label: 'Customer',
    short: 'CU',
    bg: 'from-[#e8a0b4] to-[#d47a94]',
    border: 'border-[#e8a0b4]/30',
  },
};

export function RoleBadge({ role, size = 'sm' }: RoleBadgeProps) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.CUSTOMER;

  if (size === 'md') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${cfg.bg} border ${cfg.border}`}>
        <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
          <span className="text-[9px] font-bold text-[#050505]">{cfg.short}</span>
        </div>
        <span className="text-[11px] font-bold text-[#050505] tracking-wide">{cfg.label}</span>
      </div>
    );
  }

  return (
    <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${cfg.bg} border ${cfg.border} flex items-center justify-center shadow-sm`} title={cfg.label}>
      <span className="text-[7px] font-bold text-[#050505] tracking-tight">{cfg.short}</span>
    </div>
  );
}

export default RoleBadge;
