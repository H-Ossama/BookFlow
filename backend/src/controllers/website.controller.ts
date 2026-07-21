import { Request, Response, NextFunction } from 'express';
import { WebsiteService } from '../services/website.service';

function getCompanyId(req: Request): string {
  return req.user!.companyId || req.body.companyId || (req.query.companyId as string) || '';
}

export class WebsiteController {
  // Sections
  static async getSections(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = getCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const sections = await WebsiteService.getSections(companyId);
      res.json({ status: 'success', data: { sections } });
    } catch (error) { next(error); }
  }

  static async getSection(req: Request, res: Response, next: NextFunction) {
    try {
      const section = await WebsiteService.getSection(req.params.id);
      res.json({ status: 'success', data: { section } });
    } catch (error) { next(error); }
  }

  static async createSection(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = getCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const section = await WebsiteService.createSection(companyId, req.body);
      res.status(201).json({ status: 'success', data: { section } });
    } catch (error) { next(error); }
  }

  static async updateSection(req: Request, res: Response, next: NextFunction) {
    try {
      const section = await WebsiteService.updateSection(req.params.id, req.body);
      res.json({ status: 'success', data: { section } });
    } catch (error) { next(error); }
  }

  static async deleteSection(req: Request, res: Response, next: NextFunction) {
    try {
      await WebsiteService.deleteSection(req.params.id);
      res.json({ status: 'success', message: 'Section deleted' });
    } catch (error) { next(error); }
  }

  static async reorderSections(req: Request, res: Response, next: NextFunction) {
    try {
      const { updates } = req.body;
      if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({ status: 'error', message: 'updates array is required' });
      }
      await WebsiteService.reorderSections(updates);
      res.json({ status: 'success', message: 'Sections reordered' });
    } catch (error) { next(error); }
  }

  // Theme
  static async getTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = getCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const theme = await WebsiteService.getTheme(companyId);
      res.json({ status: 'success', data: { theme } });
    } catch (error) { next(error); }
  }

  static async updateTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = getCompanyId(req);
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const theme = await WebsiteService.updateTheme(companyId, req.body);
      res.json({ status: 'success', data: { theme } });
    } catch (error) { next(error); }
  }

  // Full website (for public portal)
  static async getFullWebsite(req: Request, res: Response, next: NextFunction) {
    try {
      const companyId = req.params.companyId || req.query.companyId as string;
      if (!companyId) return res.status(400).json({ status: 'error', message: 'companyId is required' });
      const website = await WebsiteService.getFullWebsite(companyId);
      res.json({ status: 'success', data: website });
    } catch (error) { next(error); }
  }
}
