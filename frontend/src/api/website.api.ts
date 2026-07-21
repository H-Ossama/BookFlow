import { apiClient } from './client';
import type { WebsiteSection, WebsiteTheme } from '../types/website.types';

export const websiteApi = {
  getSections: async (companyId: string) => {
    const res = await apiClient.get('/website', { params: { companyId } });
    return res.data.data.sections as WebsiteSection[];
  },

  getSection: async (id: string) => {
    const res = await apiClient.get(`/website/${id}`);
    return res.data.data.section as WebsiteSection;
  },

  createSection: async (companyId: string, data: { sectionType: string; layoutVariant?: string; content?: any }) => {
    const res = await apiClient.post('/website', { ...data, companyId });
    return res.data.data.section as WebsiteSection;
  },

  updateSection: async (id: string, data: Partial<WebsiteSection>) => {
    const res = await apiClient.patch(`/website/${id}`, data);
    return res.data.data.section as WebsiteSection;
  },

  deleteSection: async (id: string) => {
    await apiClient.delete(`/website/${id}`);
  },

  reorderSections: async (updates: { id: string; sortOrder: number }[]) => {
    await apiClient.patch('/website/reorder', { updates });
  },

  getTheme: async (companyId: string) => {
    const res = await apiClient.get('/website/theme', { params: { companyId } });
    return res.data.data.theme as WebsiteTheme;
  },

  updateTheme: async (data: Partial<WebsiteTheme>) => {
    const res = await apiClient.patch('/website/theme', data);
    return res.data.data.theme as WebsiteTheme;
  },

  getFullWebsite: async (companyId: string) => {
    const res = await apiClient.get(`/website/full/${companyId}`);
    return res.data.data as { sections: WebsiteSection[]; theme: WebsiteTheme };
  },
};
