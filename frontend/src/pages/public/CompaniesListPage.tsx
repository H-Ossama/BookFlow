import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiClient } from '../../api/client';
import { Building2, MapPin, ChevronRight } from 'lucide-react';

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

  useEffect(() => {
    apiClient.get('/company').then((res) => {
      setCompanies(res.data.data.companies);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c5a880] border-t-transparent" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-2">Find a Business</h1>
      <p className="text-gray-400 mb-8">Browse companies and book appointments</p>
      {companies.length === 0 ? (
        <div className="text-center py-16 bg-[#121620] border border-white/5 rounded-xl">
          <p className="text-gray-500">No businesses registered yet</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {companies.map((c) => (
            <Link key={c.id} to={`/book/${c.slug}`} className="bg-[#121620] border border-white/5 rounded-xl p-5 flex items-center justify-between hover:border-white/10 hover:bg-[#1a202c]/30 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#c5a880]/10 flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-[#c5a880]" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{c.name}</h3>
                  {c.description && <p className="text-sm text-gray-400 mt-0.5">{c.description}</p>}
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                    {c.address && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.address}</span>}
                  </div>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-500 group-hover:text-[#c5a880] transition-colors" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default CompaniesListPage;
