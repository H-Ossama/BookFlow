import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { ArrowUpRight, Building2, Globe2, Mail, MapPin, Phone, Search, ShieldCheck } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
}

export function CompaniesListPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    apiClient.get('/company').then((res) => {
      setCompanies(res.data.data.companies);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filteredCompanies = companies.filter((company) => `${company.name} ${company.description || ''} ${company.address || ''}`.toLowerCase().includes(query.toLowerCase()));
  const withEmail = companies.filter((company) => company.email).length;
  const withBookingPage = companies.filter((company) => company.slug).length;

  return (
    <main className="bf-companies-page">
      <section className="bf-companies-hero">
        <div>
          <span className="bf-section-label"><ShieldCheck size={13} /> ADMIN BUSINESS REGISTRY</span>
          <h1>Registered<br /><em>businesses.</em></h1>
          <p>Monitor every business using BookFlow, review their public booking details, and keep the platform directory tidy from one admin-only workspace.</p>
        </div>
        <div className="bf-companies-summary">
          <article><span>Total</span><strong>{companies.length}</strong><small>registered businesses</small></article>
          <article><span>Booking pages</span><strong>{withBookingPage}</strong><small>active slugs</small></article>
          <article><span>Contactable</span><strong>{withEmail}</strong><small>with email on file</small></article>
        </div>
      </section>
      <section className="bf-companies-results">
        <div className="bf-companies-toolbar">
          <div className="bf-companies-search"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, description, or address..." aria-label="Search registered businesses" /></div>
          <div className="bf-results-meta"><span>{loading ? 'Loading registry...' : `${filteredCompanies.length} shown`}</span><span>SUPER ADMIN</span></div>
        </div>
        {loading ? (
          <div className="bf-company-empty"><div className="bf-company-loader" /><p>Loading registered businesses...</p></div>
        ) : filteredCompanies.length === 0 ? (
          <div className="bf-company-empty"><Building2 size={25} /><p>{query ? 'No businesses match that search.' : 'No businesses registered yet.'}</p><small>The registry will populate when company admins create businesses.</small></div>
        ) : (
          <div className="bf-company-grid">
            {filteredCompanies.map((company) => (
              <Link key={company.id} to={`/book/${company.slug}`} className="bf-company-card">
                <div className="bf-company-card-top"><span className="bf-company-icon"><Building2 size={20} /></span><ArrowUpRight size={17} /></div>
                <h2>{company.name}</h2>
                <p>{company.description || 'No company description has been added yet.'}</p>
                <div className="bf-company-details">
                  <span><Globe2 size={13} />/{company.slug}</span>
                  {company.address && <span><MapPin size={13} />{company.address}</span>}
                  {company.email && <span><Mail size={13} />{company.email}</span>}
                  {company.phone && <span><Phone size={13} />{company.phone}</span>}
                </div>
                <span className="bf-company-book">Open public booking page <ArrowUpRight size={14} /></span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default CompaniesListPage;
