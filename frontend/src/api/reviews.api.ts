import { apiClient } from './client';

export interface Review {
  id: string;
  customerId: string;
  companyId: string;
  bookingId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  booking: { service: { name: string } };
}

export interface ReviewListData {
  reviews: Review[];
  average: number;
  total: number;
}

export const reviewsApi = {
  getAll: async (companyId: string) => {
    const response = await apiClient.get('/review', { params: { companyId } });
    return response.data.data as ReviewListData;
  },

  create: async (data: { bookingId: string; companyId: string; rating: number; comment?: string }) => {
    const response = await apiClient.post('/review', data);
    return response.data.data.review as Review;
  },
};
