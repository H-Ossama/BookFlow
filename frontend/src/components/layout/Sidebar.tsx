import { useState, useRef, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Settings, Scissors, Users, Calendar, Star, Tag, CreditCard, LogOut, BookOpen, BarChart3, Building2, User, ChevronDown, X, TrendingUp } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import { ProfileAvatar } from '../common/ProfileAvatar';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const adminLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/services', label: 'Services', icon: Scissors },
  { to: '/dashboard/employees', label: 'Employees', icon: Users },
  { to: '/dashboard/bookings', label: 'Bookings', icon: Calendar },
  { to: '/dashboard/coupons', label: 'Coupons', icon: Tag },
  { to: '/dashboard/reviews', label: 'Reviews', icon: Star },
  { to: '/dashboard/reports', label: 'Reports', icon: BarChart3 },
  { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

const superAdminLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/companies', label: 'Businesses', icon: Building2 },
  { to: '/admin/platform-stats', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/services', label: 'Services', icon: Scissors },
  { to: '/admin/employees', label: 'Employees', icon: Users },
  { to: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { to: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/coupons', label: 'Coupons', icon: Tag },
];

const customerLinks = [
  { to: '/dashboard/my-bookings', label: 'My Bookings', icon: BookOpen },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuthContext();
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarImage, setSidebarImage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const links = user?.role === 'CUSTOMER' ? customerLinks : user?.role === 'SUPER_ADMIN' ? superAdminLinks : adminLinks;

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!user) return;
    const load = () => {
      try {
        const saved = localStorage.getItem(`bf_profile_image_${user.id}`);
        setSidebarImage(saved || null);
      } catch { setSidebarImage(null); }
    };
    load();
    window.addEventListener('profile-image-changed', load);
    return () => window.removeEventListener('profile-image-changed', load);
  }, [user]);

  return (
    <>
      <aside className={`
        dashboard-sidebar fixed inset-y-0 left-0 z-30 flex flex-col
        transition-transform duration-200 ease-in-out
        lg:static lg:translate-x-0
        ${open ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="sidebar-brand flex items-center justify-between">
          <Link to={user?.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard'} onClick={onClose}
            className="relative flex items-center gap-3 px-3 py-2.5 mx-3 my-2 rounded-xl transition-all group">
            <div className="shrink-0 w-[22px] h-[22px] rounded-[50%_50%_50%_5px] -rotate-45 bg-[#86d6c8] shadow-[3px_3px_0_rgba(134,214,200,.3)] group-hover:shadow-[3px_3px_0_rgba(134,214,200,.7)] group-hover:scale-110 transition-all duration-300 -mt-[1px] [backface-visibility:hidden] [outline:none]" />
            <div className="relative">
              <h1 className="text-base font-bold text-white font-serif tracking-tight leading-none">BookFlow<span className="text-[#86d6c8]">.</span></h1>
              <p className="text-[9px] font-mono uppercase tracking-[.12em] text-[#86d6c8]/60 mt-0.5">Dashboard</p>
              <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-[2px] bg-[#86d6c8] rounded-full w-0 group-hover:w-full transition-all duration-300 ease-out" />
            </div>
          </Link>
          <button onClick={onClose} className="lg:hidden text-[#aaa9a5] hover:text-white transition-colors cursor-pointer mr-4">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/dashboard/my-bookings' || link.to === '/admin'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-[#86d6c8]/10 text-[#86d6c8]' : 'text-[#aaa9a5] hover:text-white hover:bg-white/[.06]'
                }`
              }
            >
              <link.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{link.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/[.08] relative" ref={menuRef}>
          <button onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-white/[.06] transition-all cursor-pointer">
            <div className="shrink-0 w-9">
              {user && <ProfileAvatar role={user.role} imageUrl={sidebarImage} size="sm" />}
            </div>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.firstName} {user?.lastName}</p>
              <p className="text-[10px] font-mono uppercase tracking-[.08em] text-[#aaa9a5] truncate">
                {user?.role === 'COMPANY_ADMIN' ? 'Manager' : user?.role === 'SUPER_ADMIN' ? 'Super Admin' : user?.role === 'EMPLOYEE' ? 'Employee' : 'Customer'}
              </p>
            </div>
            <ChevronDown className={`h-4 w-4 text-[#aaa9a5] shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>
          {profileOpen && (
            <div className="absolute bottom-full left-3 right-3 mb-1 glass-card rounded-xl overflow-hidden shadow-xl">
              <NavLink to="/dashboard/profile"
                onClick={() => { setProfileOpen(false); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#aaa9a5] hover:text-white hover:bg-white/[.06] transition-colors">
                <User className="h-4 w-4" /> Profile
              </NavLink>
              <button onClick={() => { logout(); onClose(); }}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#aaa9a5] hover:text-[#e8a0b4] hover:bg-white/[.06] transition-colors w-full cursor-pointer">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
