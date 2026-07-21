import { Link } from 'react-router-dom';
export function Footer() { return <footer className="bf-footer"><div><Link to="/" className="bf-nav-brand"><span className="bf-nav-mark" />BookFlow</Link><p>Every booking, in its right place.</p></div><div><Link to="/pricing">Plans</Link><a href="/#contact">Contact</a><Link to="/register">Start free</Link></div><small>© 2026 BookFlow</small></footer>; }
export default Footer;
