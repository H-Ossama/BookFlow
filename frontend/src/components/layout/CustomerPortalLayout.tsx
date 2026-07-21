import { Link, useLocation, Routes, Route } from 'react-router-dom';
import { useCustomerPortal } from '../../context/CustomerPortalContext';
import { Menu, X, CalendarDays, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';
import { useState, useEffect, type ReactNode } from 'react';
import { renderSection } from '../website-builder/sections';
import type { WebsiteSection, WebsiteTheme } from '../../types/website.types';
import { websiteApi } from '../../api/website.api';
import CustomerHomePage from '../../pages/customer-portal/CustomerHomePage';
import CustomerServicesPage from '../../pages/customer-portal/CustomerServicesPage';
import CustomerAboutPage from '../../pages/customer-portal/CustomerAboutPage';
import CustomerBookingPage from '../../pages/customer-portal/CustomerBookingPage';
import CustomerContactPage from '../../pages/customer-portal/CustomerContactPage';

const DEFAULT_THEME: WebsiteTheme = {
  id: '', companyId: '', primaryColor: '#c5a880', secondaryColor: '#0a0c10',
  accentColor: '#e8d5b8', backgroundColor: '#0a0c10', textColor: '#ffffff',
  fontFamily: 'Inter', borderRadius: '12px', buttonStyle: 'solid', animationStyle: 'fade',
};

function applyThemeVars(theme: WebsiteTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--primary', theme.primaryColor);
  root.style.setProperty('--secondary', theme.secondaryColor);
  root.style.setProperty('--accent', theme.accentColor);
  root.style.setProperty('--bg', theme.backgroundColor);
  root.style.setProperty('--text', theme.textColor);
  root.style.setProperty('--radius', theme.borderRadius);
  root.style.setProperty('--font', theme.fontFamily);
}

export function CustomerPortalHeader() {
  const { company } = useCustomerPortal();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  if (!company) return null;

  const isHome = pathname === '' || pathname === '/';

  const links = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/book', label: 'Book Now' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || !isHome ? 'bg-[#0a0c10]/95 backdrop-blur-lg border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            {company.logo ? (
              <img src={company.logo} alt={company.name} className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg object-cover shrink-0" />
            ) : (
              <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-[var(--primary,#c5a880)] flex items-center justify-center text-[#0a0c10] font-bold text-xs sm:text-sm shrink-0">
                {company.name.charAt(0)}
              </div>
            )}
            <span className="text-white font-semibold text-sm sm:text-base lg:text-lg truncate max-w-[140px] sm:max-w-[200px] lg:max-w-none">{company.name}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
              return (
                <Link key={link.to} to={link.to}
                  className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg text-xs lg:text-sm font-medium transition-all ${
                    active ? 'bg-[var(--primary)]/10 text-[var(--primary,#c5a880)]' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link to="/book"
            className="hidden md:inline-flex items-center gap-2 px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl text-[#0a0c10] text-xs lg:text-sm font-semibold hover:opacity-90 transition-all shrink-0"
            style={{ backgroundColor: 'var(--primary, #c5a880)' }}>
            <CalendarDays className="h-3.5 w-3.5 lg:h-4 lg:w-4" /> <span className="hidden sm:inline">Book Now</span><span className="sm:hidden">Book</span>
          </Link>

          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex items-center justify-center ml-1 p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 active:bg-white/15 transition-all touch-manipulation min-w-[44px] min-h-[44px]">
            {mobileOpen ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu with slide animation */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        mobileOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="border-t border-white/5 bg-[#0a0c10]/98 backdrop-blur-lg">
          <nav className="px-3 sm:px-4 py-3 space-y-0.5">
            {links.map((link) => {
              const active = link.to === '/' ? pathname === '/' : pathname.startsWith(link.to);
              return (
                <Link key={link.to} to={link.to}
                  className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-[0.98] ${
                    active ? 'bg-[var(--primary)]/10 text-[var(--primary,#c5a880)]' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}>
                  {link.label}
                </Link>
              );
            })}
            <Link to="/book"
              className="flex items-center justify-center gap-2 mt-2 px-5 py-3.5 rounded-xl text-[#0a0c10] text-sm font-semibold active:scale-[0.98] transition-transform"
              style={{ backgroundColor: 'var(--primary, #c5a880)' }}>
              <CalendarDays className="h-4 w-4" /> Book Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export function CustomerPortalFooter() {
  const { company } = useCustomerPortal();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!company) return null;

  return (
    <>
      <footer className="bg-[#0a0c10] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} className="h-8 w-8 rounded-lg object-cover" />
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-[var(--primary,#c5a880)] flex items-center justify-center text-[#0a0c10] font-bold text-sm">
                    {company.name.charAt(0)}
                  </div>
                )}
                <span className="text-white font-semibold">{company.name}</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                {company.description || 'Book your appointment online, anytime.'}
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {[{ to: '/', label: 'Home' }, { to: '/services', label: 'Services' }, { to: '/about', label: 'About Us' }, { to: '/book', label: 'Book Now' }, { to: '/contact', label: 'Contact' }].map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-gray-400 hover:text-[var(--primary,#c5a880)] text-sm transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Contact</h3>
              <ul className="space-y-3">
                {company.address && <li className="flex items-start gap-3 text-gray-400 text-sm"><MapPin className="h-4 w-4 mt-0.5 text-[var(--primary,#c5a880)] shrink-0" />{company.address}</li>}
                {company.phone && <li className="flex items-center gap-3 text-gray-400 text-sm"><Phone className="h-4 w-4 text-[var(--primary,#c5a880)] shrink-0" /><a href={`tel:${company.phone}`} className="hover:text-[var(--primary,#c5a880)] transition-colors">{company.phone}</a></li>}
                {company.email && <li className="flex items-center gap-3 text-gray-400 text-sm"><Mail className="h-4 w-4 text-[var(--primary,#c5a880)] shrink-0" /><a href={`mailto:${company.email}`} className="hover:text-[var(--primary,#c5a880)] transition-colors">{company.email}</a></li>}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-xs">&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
            <p className="text-gray-600 text-xs">Powered by BookingHub</p>
          </div>
        </div>
      </footer>
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 p-3 rounded-full text-[#0a0c10] shadow-lg hover:opacity-90 transition-all z-40"
          style={{ backgroundColor: 'var(--primary, #c5a880)' }}>
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </>
  );
}

// ─── Section-based homepage ──────────────────────────────
function SectionHomePage() {
  const { company } = useCustomerPortal();
  const [websiteSections, setWebsiteSections] = useState<WebsiteSection[]>([]);
  const [websiteTheme, setWebsiteTheme] = useState<WebsiteTheme>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!company) return;
    applyThemeVars(websiteTheme);
  }, [websiteTheme]);

  useEffect(() => {
    if (!company) return;
    setLoading(true);
    websiteApi.getFullWebsite(company.id)
      .then((data) => {
        setWebsiteSections(data.sections);
        setWebsiteTheme(data.theme || DEFAULT_THEME);
      })
      .catch(() => {
        setWebsiteSections([]);
      })
      .finally(() => setLoading(false));
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg, #0a0c10)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--primary, #c5a880)', borderTopColor: 'transparent' }} />
        </div>
      </div>
    );
  }

  if (websiteSections.length === 0) {
    return <CustomerHomePage />;
  }

  return (
    <div style={{ fontFamily: 'var(--font, Inter)', backgroundColor: 'var(--bg, #0a0c10)', color: 'var(--text, #ffffff)' }}>
      {websiteSections.filter((s) => s.isVisible !== false).map((section) => (
        <div key={section.id}>
          {renderSection(section.sectionType, section.layoutVariant, section.content, websiteTheme)}
        </div>
      ))}
    </div>
  );
}

function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: 'var(--bg, #0a0c10)' }}>
      <CustomerPortalHeader />
      {children}
      <CustomerPortalFooter />
    </div>
  );
}

export function CustomerPortalShell() {
  const { company, loading, error } = useCustomerPortal();

  // Set browser tab title and favicon
  useEffect(() => {
    if (!company) return;
    document.title = company.name;
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (link && company.logo) {
      link.href = company.logo;
    }
  }, [company]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg, #0a0c10)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" style={{ borderColor: 'var(--primary, #c5a880)', borderTopColor: 'transparent' }} />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg, #0a0c10)' }}>
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center"><span className="text-2xl">!</span></div>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-400 mb-8">{error || 'This business page does not exist.'}</p>
          <a href={`https://${import.meta.env.VITE_ROOT_DOMAIN || 'bookinghub.com'}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[#0a0c10] font-semibold hover:opacity-90 transition-all"
            style={{ backgroundColor: 'var(--primary, #c5a880)' }}>
            Go to BookingHub
          </a>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<SectionHomePage />} />
      <Route path="/services" element={<PortalLayout><CustomerServicesPage /></PortalLayout>} />
      <Route path="/about" element={<PortalLayout><CustomerAboutPage /></PortalLayout>} />
      <Route path="/book" element={<PortalLayout><CustomerBookingPage /></PortalLayout>} />
      <Route path="/contact" element={<PortalLayout><CustomerContactPage /></PortalLayout>} />
      <Route path="*" element={<SectionHomePage />} />
    </Routes>
  );
}
