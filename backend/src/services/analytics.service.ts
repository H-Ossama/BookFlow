import { AnalyticsRepository } from '../repositories/analytics.repository';

export class AnalyticsService {
  static async getDashboard(companyId: string, dateFrom?: string, dateTo?: string) {
    const now = new Date();
    const start = dateFrom ? new Date(dateFrom) : new Date(now.getFullYear(), now.getMonth(), 1);
    const end = dateTo ? new Date(dateTo) : now;

    const [stats, recentBookings] = await Promise.all([
      AnalyticsRepository.dashboardStats(companyId, start, end),
      AnalyticsRepository.recentBookings(companyId, 10),
    ]);

    return { ...stats, recentBookings };
  }
}
