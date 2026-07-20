import { apiClient } from './client';
import type { Company } from '../types/company.types';

export const companiesApi = {
  getAll: async (params?: { page?: number; limit?: number; search?: string }) => {
    const response = await apiClient.get('/company', { params });
    return response.data.data;
  },

  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/company/slug/${slug}`);
    return response.data.data.company as Company;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/company/${id}`);
    return response.data.data.company as Company;
  },

  update: async (id: string, data: Partial<Company>) => {
    const response = await apiClient.patch(`/company/${id}`, data);
    return response.data.data.company as Company;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/company/${id}`);
    return response.data;
  },
};
