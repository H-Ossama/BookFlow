import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TITLE_MAP: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/dashboard/settings': 'Settings',
  '/dashboard/services': 'Services',
  '/dashboard/employees': 'Employees',
  '/dashboard/bookings': 'Bookings',
  '/dashboard/reviews': 'Reviews',
  '/dashboard/coupons': 'Coupons',
  '/dashboard/subscription': 'Subscription',
  '/dashboard/reports': 'Reports',
  '/dashboard/my-bookings': 'My Bookings',
  '/dashboard/profile': 'Profile',
  '/login': 'Sign In',
  '/register': 'Sign Up',
  '/book': 'Book',
  '/pricing': 'Pricing',
  '/companies': 'Businesses',
  '/': 'Home',
};

export function RouteTitleObserver() {
  const location = useLocation();
  useEffect(() => {
    const path = Object.keys(TITLE_MAP).find((p) =>
      location.pathname === p || (p !== '/' && location.pathname.startsWith(p))
    );
    const page = path ? TITLE_MAP[path] : '';
    document.title = page ? `${page} · BookFlow` : 'BookFlow';
  }, [location]);
  return null;
}
