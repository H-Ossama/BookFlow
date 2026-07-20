export interface Service {
  id: string;
  name: string;
  description: string | null;
  duration: number;
  price: number;
  color: string | null;
  isActive: boolean;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}
