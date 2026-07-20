import { CompanyRepository } from '../repositories/company.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class CompanyService {
  static async list(params: { page?: number; limit?: number; search?: string }) {
    return CompanyRepository.findAll(params);
  }

  static async getBySlug(slug: string) {
    const company = await CompanyRepository.findBySlug(slug);
    if (!company) throw new NotFoundError('Company not found');
    return company;
  }

  static async getById(id: string) {
    const company = await CompanyRepository.findById(id);
    if (!company) throw new NotFoundError('Company not found');
    return company;
  }

  static async update(companyId: string, userId: string, userRole: string, data: any) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company not found');

    if (userRole !== 'SUPER_ADMIN' && userId !== companyId) {
      throw new ForbiddenError('You do not have permission to update this company');
    }

    return CompanyRepository.update(companyId, data);
  }

  static async delete(companyId: string, userRole: string) {
    if (userRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only super admins can delete companies');
    }
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company not found');
    return CompanyRepository.delete(companyId);
  }
}
