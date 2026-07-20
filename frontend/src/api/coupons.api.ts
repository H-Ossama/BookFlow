import { apiClient } from './client';

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number | null;
  currentUses: number;
  expiresAt: string | null;
  isActive: boolean;
  companyId: string;
  createdAt: string;
}

export const couponsApi = {
  getAll: async (companyId: string) => {
    const response = await apiClient.get('/coupon', { params: { companyId } });
    return response.data.data.coupons as Coupon[];
  },

  create: async (companyId: string, data: { code: string; discountPercent: number; maxUses?: number; expiresAt?: string }) => {
    const response = await apiClient.post('/coupon', { ...data, companyId });
    return response.data.data.coupon as Coupon;
  },

  update: async (id: string, companyId: string, data: Partial<Coupon>) => {
    const response = await apiClient.patch(`/coupon/${id}`, { ...data, companyId });
    return response.data.data.coupon as Coupon;
  },
};
