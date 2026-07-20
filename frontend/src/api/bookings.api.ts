import { apiClient } from './client';
import type { Booking, PaginatedResult, TimeSlot, CreateBookingPayload } from '../types/booking.types';

export const bookingsApi = {
  getAll: async (params: {
    companyId?: string;
    employeeId?: string;
    customerId?: string;
    status?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get('/booking', { params });
    return response.data.data as PaginatedResult<Booking>;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/booking/${id}`);
    return response.data.data.booking as Booking;
  },

  create: async (data: CreateBookingPayload) => {
    const response = await apiClient.post('/booking', data);
    return response.data.data.booking as Booking;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.patch(`/booking/${id}/status`, { status });
    return response.data.data.booking as Booking;
  },

  reschedule: async (id: string, data: { date: string; startTime: string }) => {
    const response = await apiClient.patch(`/booking/${id}/reschedule`, data);
    return response.data.data.booking as Booking;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/booking/${id}`);
    return response.data;
  },

  getAvailability: async (companyId: string, employeeId: string, date: string) => {
    const response = await apiClient.get('/availability', { params: { companyId, employeeId, date } });
    return response.data.data.slots as TimeSlot[];
  },
};
