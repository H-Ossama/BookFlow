import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from '../api/client';

interface PortalEmployee {
  id: string;
  userId: string;
  bio: string | null;
  specialties: string[];
  user: { id: string; firstName: string; lastName: string; avatar: string | null };
  workingHours: { dayOfWeek: number; startTime: string; endTime: string }[];
}

interface PortalService {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  color: string | null;
  isActive: boolean;
}

interface PortalReview {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: { service: { name: string } };
}

interface PortalCompany {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  services: PortalService[];
  employees: PortalEmployee[];
  reviews: PortalReview[];
  _count: { reviews: number };
}

interface CustomerPortalContextValue {
  company: PortalCompany | null;
  loading: boolean;
  error: string | null;
  slug: string | null;
}

const CustomerPortalContext = createContext<CustomerPortalContextValue>({
  company: null,
  loading: true,
  error: null,
  slug: null,
});

export function CustomerPortalProvider({ slug, children }: { slug: string; children: ReactNode }) {
  const [company, setCompany] = useState<PortalCompany | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiClient.get(`/company/slug/${slug}`)
      .then((res) => {
        setCompany(res.data.data.company);
      })
      .catch((err) => {
        setError(err?.response?.data?.message || 'Company not found');
      })
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <CustomerPortalContext.Provider value={{ company, loading, error, slug }}>
      {children}
    </CustomerPortalContext.Provider>
  );
}

export const useCustomerPortal = () => useContext(CustomerPortalContext);
