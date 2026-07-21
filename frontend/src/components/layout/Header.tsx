import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

export function Header() {
  const { user } = useAuthContext();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAuth = ['/login', '/register', '/forgot-password', '/reset-password', '/verify-email'].includes(pathname);
  if (isAuth || pathname.startsWith('/book/')) return null;
  return <header className={`bf-nav ${mobileOpen ? 'is-open' : ''}`}><Link to="/" className="bf-nav-brand"><span className="bf-nav-mark" />BookFlow</Link><button className="bf-nav-menu" type="button" onClick={() => setMobileOpen((open) => !open)} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}>{mobileOpen ? <X size={20} /> : <Menu size={20} />}</button><nav onClick={() => setMobileOpen(false)}><a href="/#home">Home</a><a href="/#about">About</a><a href="/#how-it-works">How it works</a><a href="/#features">Features</a><Link to="/pricing">Pricing</Link><a href="/#stories">Reviews</a><a href="/#contact">Contact</a></nav>{user ? <Link to="/dashboard" className="bf-nav-signin">Open dashboard</Link> : <Link to="/login" className="bf-nav-signin">Sign in</Link>}</header>;
}
export default Header;
