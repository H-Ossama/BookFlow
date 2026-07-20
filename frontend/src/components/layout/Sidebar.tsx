import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Scissors, Users, Calendar, Star, Tag, CreditCard, LogOut, BookOpen, BarChart3 } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

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

const customerLinks = [
  { to: '/dashboard/my-bookings', label: 'My Bookings', icon: BookOpen },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const { user, logout } = useAuthContext();
  const links = user?.role === 'CUSTOMER' ? customerLinks : adminLinks;

  return (
    <aside className="dashboard-sidebar w-64 bg-[#0d0f12] border-r border-white/5 h-full flex flex-col">
      <div className="sidebar-brand p-6">
        <h1 className="text-xl font-bold text-white font-serif tracking-tight">BookFlow<span className="text-[#dce772]">.</span></h1>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/dashboard' || link.to === '/dashboard/my-bookings'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-[#c5a880]/10 text-[#c5a880]' : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-3 border-t border-white/5">
        <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 w-full transition-colors cursor-pointer">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}
