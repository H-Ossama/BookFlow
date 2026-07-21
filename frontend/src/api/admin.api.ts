import { apiClient } from './client';

export interface AdminDashboardData {
  totalCompanies: number;
  activeCompanies: number;
  pendingCompanies: number;
  totalUsers: number;
  totalBookings: number;
  periodBookings: number;
  periodRevenue: number;
  totalRevenue: number;
  todayBookings: number;
  subscriptionDistribution: { FREE: number; BASIC: number; PREMIUM: number };
  recentCompanies: Array<{
    id: string; name: string; slug: string;
    subscriptionPlan: string; isActive: boolean; createdAt: string;
    _count: { users: number; services: number; bookings: number };
  }>;
  monthlyTrend: Array<{ month: string; bookings: number; revenue: number }>;
}

export interface PlatformStatsData {
  totalUsers: number;
  roleDistribution: Record<string, number>;
  bookingStatusDistribution: Record<string, number>;
  totalReviews: number;
  averageRating: number;
  totalCoupons: number;
  activeCoupons: number;
  topCompanies: Array<{
    id: string; name: string; subscriptionPlan: string;
    isActive: boolean; bookingCount: number; reviewCount: number;
  }>;
}

export interface PlanData {
  id: string; name: string; description: string | null;
  price: number; monthlyBookings: number; employees: number;
  features: string[]; isActive: boolean; sortOrder: number;
  createdAt: string; updatedAt: string;
}

export interface FeatureData {
  id: string; name: string; description: string | null;
  key: string; category: string | null;
  createdAt: string; updatedAt: string;
}

export interface CouponData {
  id: string; code: string; description: string | null;
  discountPercent: number; maxUses: number | null;
  currentUses: number; expiresAt: string | null;
  isActive: boolean; applicablePlans: string[];
  createdAt: string; updatedAt: string;
}

export interface CompanyDetail {
  id: string; name: string; slug: string; email: string | null;
  phone: string | null; description: string | null; address: string | null;
  logo: string | null; isActive: boolean; subscriptionPlan: string;
  createdAt: string;
  _count: { users: number; services: number; employees: number; bookings: number; reviews: number; coupons: number };
  users: Array<{ id: string; firstName: string; lastName: string; email: string; role: string; createdAt: string }>;
  recentBookings: Array<{
    id: string; date: string; startTime: string; endTime: string; status: string;
    service: { name: string }; employee: { user: { firstName: string; lastName: string } };
  }>;
}

export interface RevenueSummary {
  totalBookings: number;
  totalRevenue: number;
  totalDiscount: number;
  netRevenue: number;
  averageBookingValue: number;
}

export interface PeriodRevenue {
  bookings: number;
  revenue: number;
  discount: number;
}

export interface RevenueByService {
  serviceId: string;
  serviceName: string;
  bookingCount: number;
  totalRevenue: number;
  totalDiscount: number;
  avgPrice: number;
}

export interface RecentTransaction {
  id: string;
  date: string;
  service: string;
  employee: string;
  amount: number;
  discount: number;
}

export interface CompanyRevenue {
  summary: RevenueSummary;
  periodRevenue: PeriodRevenue;
  yearRevenue: PeriodRevenue;
  revenueByService: RevenueByService[];
  recentTransactions: RecentTransaction[];
}

export const adminApi = {
  getDashboard: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data.data as AdminDashboardData;
  },

  getCompanies: async (params?: { page?: number; limit?: number; search?: string; plan?: string; isActive?: string }) => {
    const response = await apiClient.get('/admin/companies', { params });
    return response.data.data as { companies: any[]; total: number; page: number; limit: number; totalPages: number };
  },

  getPlatformStats: async () => {
    const response = await apiClient.get('/admin/platform-stats');
    return response.data.data as PlatformStatsData;
  },

  getCompanyDetail: async (id: string) => {
    const response = await apiClient.get(`/admin/companies/${id}`);
    return response.data.data as CompanyDetail;
  },

  updateCompany: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/companies/${id}`, data);
    return response.data.data;
  },

  deleteCompany: async (id: string) => {
    const response = await apiClient.delete(`/admin/companies/${id}`);
    return response.data;
  },

  getCompanyRevenue: async (companyId: string) => {
    const response = await apiClient.get(`/admin/companies/${companyId}/revenue`);
    return response.data.data as CompanyRevenue;
  },

  getPlans: async () => {
    const response = await apiClient.get('/admin/plans');
    return response.data.data.plans as PlanData[];
  },

  createPlan: async (data: any) => {
    const response = await apiClient.post('/admin/plans', data);
    return response.data.data.plan as PlanData;
  },

  updatePlan: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/plans/${id}`, data);
    return response.data.data.plan as PlanData;
  },

  deletePlan: async (id: string) => {
    const response = await apiClient.delete(`/admin/plans/${id}`);
    return response.data;
  },

  getCoupons: async () => {
    const response = await apiClient.get('/admin/coupons');
    return response.data.data.coupons as CouponData[];
  },

  createCoupon: async (data: any) => {
    const response = await apiClient.post('/admin/coupons', data);
    return response.data.data.coupon as CouponData;
  },

  updateCoupon: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/coupons/${id}`, data);
    return response.data.data.coupon as CouponData;
  },

  deleteCoupon: async (id: string) => {
    const response = await apiClient.delete(`/admin/coupons/${id}`);
    return response.data;
  },

  getFeatures: async () => {
    const response = await apiClient.get('/admin/features');
    return response.data.data.features as FeatureData[];
  },

  createFeature: async (data: any) => {
    const response = await apiClient.post('/admin/features', data);
    return response.data.data.feature as FeatureData;
  },

  updateFeature: async (id: string, data: any) => {
    const response = await apiClient.patch(`/admin/features/${id}`, data);
    return response.data.data.feature as FeatureData;
  },

  deleteFeature: async (id: string) => {
    const response = await apiClient.delete(`/admin/features/${id}`);
    return response.data;
  },
};
