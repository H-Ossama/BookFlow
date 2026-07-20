import { apiClient } from './client';
import type { Employee } from '../types/employee.types';
import type { VacationDay } from '../types/employee.types';

export const employeesApi = {
  getAll: async (companyId: string) => {
    const response = await apiClient.get('/employee', { params: { companyId } });
    return response.data.data.employees as Employee[];
  },

  getById: async (id: string, companyId: string) => {
    const response = await apiClient.get(`/employee/${id}`, { params: { companyId } });
    return response.data.data.employee as Employee;
  },

  create: async (data: { companyId: string; email: string; firstName: string; lastName: string; phone?: string; bio?: string; specialties?: string[] }) => {
    const response = await apiClient.post('/employee', data);
    return response.data.data as { employee: Employee; tempPassword?: string };
  },

  update: async (id: string, data: Partial<Employee>) => {
    const response = await apiClient.patch(`/employee/${id}`, data);
    return response.data.data.employee as Employee;
  },

  delete: async (id: string, companyId: string) => {
    const response = await apiClient.delete(`/employee/${id}`, { params: { companyId } });
    return response.data;
  },

  setWorkingHours: async (employeeId: string, companyId: string, schedules: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }[]) => {
    const response = await apiClient.put(`/employee/${employeeId}/working-hours`, { companyId, schedules });
    return response.data;
  },

  getWorkingHours: async (employeeId: string, companyId: string) => {
    const response = await apiClient.get(`/employee/${employeeId}/working-hours`, { params: { companyId } });
    return response.data.data.workingHours;
  },

  getVacationDays: async (employeeId: string, companyId: string) => {
    const response = await apiClient.get(`/employee/${employeeId}`, { params: { companyId } });
    return (response.data.data.employee.vacationDays || []) as VacationDay[];
  },

  addVacationDay: async (employeeId: string, companyId: string, data: { date: string; reason?: string }) => {
    const response = await apiClient.post(`/employee/${employeeId}/vacations`, { ...data, companyId });
    return response.data.data.vacation;
  },

  removeVacationDay: async (employeeId: string, vacationId: string, companyId: string) => {
    const response = await apiClient.delete(`/employee/${employeeId}/vacations/${vacationId}`, { params: { companyId } });
    return response.data;
  },
};
