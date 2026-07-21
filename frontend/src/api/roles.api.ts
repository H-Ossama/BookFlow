import { apiClient } from './client';
import type { CompanyRole } from '../types/employee.types';

export const rolesApi = {
  getAll: async () => {
    const response = await apiClient.get('/company/roles');
    return response.data.data.roles as CompanyRole[];
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/company/roles/${id}`);
    return response.data.data.role as CompanyRole;
  },

  create: async (data: { name: string; description?: string; permissions: string[] }) => {
    const response = await apiClient.post('/company/roles', data);
    return response.data.data.role as CompanyRole;
  },

  update: async (id: string, data: { name?: string; description?: string; permissions?: string[] }) => {
    const response = await apiClient.patch(`/company/roles/${id}`, data);
    return response.data.data.role as CompanyRole;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/company/roles/${id}`);
    return response.data;
  },
};
