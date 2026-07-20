import { apiClient } from './client';

export interface DashboardStats {
  todayBookings: number;
  periodRevenue: number;
  periodBookingsCount: number;
  cancellationRate: number;
  topEmployees: { id: string; name: string; bookingCount: number }[];
  popularServices: { id: string; name: string; price: number; bookingCount: number }[];
  recentBookings: {
    id: string;
    customerId: string;
    startTime: string;
    endTime: string;
    status: string;
    totalPrice: number;
    createdAt: string;
    employee: { user: { firstName: string; lastName: string } };
    service: { name: string };
  }[];
}

export const analyticsApi = {
  getDashboard: async (companyId: string, dateFrom?: string, dateTo?: string) => {
    const response = await apiClient.get('/analytics/dashboard', { params: { companyId, dateFrom, dateTo } });
    return response.data.data as DashboardStats;
  },
};
