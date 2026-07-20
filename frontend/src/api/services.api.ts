import { apiClient } from './client';
import type { Service } from '../types/service.types';

export const servicesApi = {
  getAll: async (companyId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get('/service', { params: { companyId, ...params } });
    return response.data.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/service/${id}`);
    return response.data.data.service as Service;
  },

  create: async (data: { companyId: string; name: string; duration: number; price: number; description?: string; color?: string }) => {
    const response = await apiClient.post('/service', data);
    return response.data.data.service as Service;
  },

  update: async (id: string, data: Partial<Service>) => {
    const response = await apiClient.patch(`/service/${id}`, data);
    return response.data.data.service as Service;
  },

  delete: async (id: string, companyId: string) => {
    const response = await apiClient.delete(`/service/${id}`, { params: { companyId } });
    return response.data;
  },
};
