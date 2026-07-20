import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { useThemeContext } from '../../context/ThemeContext';
import { MoonStar, SunMedium } from 'lucide-react';

export function Header() {
  const { user } = useAuthContext();
  const { theme, toggleTheme } = useThemeContext();
  const { pathname } = useLocation();
  const isAuth = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(pathname);
  if (isAuth || pathname.startsWith('/book/')) return null;
  return <header className={`site-nav ${pathname === '/' ? 'landing-nav' : 'sticky top-0'} z-50`}><div className="nav-inner">
    <Link to="/" className="brand-mark"><span className="brand-orb" />BookFlow</Link>
    <nav className="nav-links"><NavLink to="/companies">Discover</NavLink><a href="/#how-it-works">How it works</a><a href="/#for-businesses">For businesses</a><NavLink to="/pricing">Pricing</NavLink><button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>{theme === 'dark' ? <SunMedium size={15} /> : <MoonStar size={15} />}</button>{user ? <Link to="/dashboard" className="nav-cta">Open dashboard</Link> : <Link to="/login" className="nav-cta">Sign in</Link>}</nav>
  </div></header>;
}
export default Header;
