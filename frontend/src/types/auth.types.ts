export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
  companyId: string | null;
  company?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}
