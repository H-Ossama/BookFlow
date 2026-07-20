import { apiClient } from './client';
import type { Notification } from '../types/notification.types';

export const notificationsApi = {
  getAll: async () => {
    const response = await apiClient.get('/notification');
    return response.data.data as { notifications: Notification[]; unreadCount: number };
  },

  markRead: async (id: string) => {
    const response = await apiClient.patch(`/notification/${id}/read`);
    return response.data;
  },

  markAllRead: async () => {
    const response = await apiClient.patch('/notification/read-all');
    return response.data;
  },
};
