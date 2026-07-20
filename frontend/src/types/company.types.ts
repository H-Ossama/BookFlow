export interface Company {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  description: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  subscriptionPlan: 'FREE' | 'BASIC' | 'PREMIUM';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: { services: number; employees: number; reviews: number };
}
