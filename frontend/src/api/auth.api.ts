import { apiClient } from './client';

export const authApi = {
  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data.data;
  },
  
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data.data;
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data.data;
  },

  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (data: any) => {
    const response = await apiClient.post('/auth/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await apiClient.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  updateProfile: async (data: { firstName?: string; lastName?: string; email?: string; currentPassword?: string; currentEmail?: string }) => {
    const response = await apiClient.patch('/auth/me', data);
    return response.data.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    const response = await apiClient.patch('/auth/me/password', data);
    return response.data;
  },
};
export default authApi;

