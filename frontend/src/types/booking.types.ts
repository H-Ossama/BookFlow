export interface Booking {
  id: string;
  customerId: string;
  employeeId: string;
  serviceId: string;
  companyId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  notes: string | null;
  totalPrice: number;
  discountAmount: number;
  couponId: string | null;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: string;
    user: { id: string; email: string; firstName: string; lastName: string };
  };
  service: { id: string; name: string; duration: number; price: number };
  company: { id: string; name: string };
  coupon: { id: string; code: string; discountPercent: number } | null;
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'REJECTED';

export interface PaginatedResult<T> {
  bookings: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  availableServices: { id: string; name: string; duration: number; price: number }[];
}

export interface CreateBookingPayload {
  employeeId: string;
  serviceId: string;
  companyId: string;
  date: string;
  startTime: string;
  notes?: string;
  couponCode?: string;
}
