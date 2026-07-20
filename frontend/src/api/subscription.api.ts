import { apiClient } from './client';
import type { Plan, CurrentPlan } from '../types/subscription.types';

export const subscriptionApi = {
  getPlans: async () => {
    const response = await apiClient.get('/subscription/plans');
    return response.data.data.plans as Plan[];
  },

  getCurrent: async (companyId: string) => {
    const response = await apiClient.get('/subscription/current', { params: { companyId } });
    return response.data.data as CurrentPlan;
  },

  changePlan: async (companyId: string, plan: string) => {
    const response = await apiClient.patch('/subscription/change', { companyId, plan });
    return response.data.data;
  },
};
