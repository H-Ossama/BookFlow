import { apiClient } from './client';
import type { Notification } from '../types/notification.types';

export interface NotificationListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
}

export const notificationsApi = {
  getAll: async (page = 1, limit = 50) => {
    const response = await apiClient.get(`/notification?page=${page}&limit=${limit}`);
    return response.data.data as NotificationListResponse;
  },

  getUnreadCount: async () => {
    const response = await apiClient.get('/notification/unread-count');
    return response.data.data as { unreadCount: number };
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
