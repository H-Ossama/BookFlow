import { apiClient } from './client';

function downloadBlob(data: Blob, filename: string) {
  const url = URL.createObjectURL(data);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export const reportsApi = {
  async downloadBookingsCSV(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/bookings/csv', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `bookings_${dateFrom}_${dateTo}.csv`);
  },
  async downloadBookingsExcel(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/bookings/excel', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `bookings_${dateFrom}_${dateTo}.xlsx`);
  },
  async downloadBookingsPDF(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/bookings/pdf', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `bookings_${dateFrom}_${dateTo}.pdf`);
  },
  async downloadRevenueCSV(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/revenue/csv', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `revenue_${dateFrom}_${dateTo}.csv`);
  },
  async downloadRevenuePDF(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/revenue/pdf', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `revenue_${dateFrom}_${dateTo}.pdf`);
  },
  async downloadCustomersCSV(companyId: string, dateFrom: string, dateTo: string) {
    const res = await apiClient.get('/report/customers/csv', { params: { companyId, dateFrom, dateTo }, responseType: 'blob' });
    downloadBlob(res.data, `customers_${dateFrom}_${dateTo}.csv`);
  },
};
