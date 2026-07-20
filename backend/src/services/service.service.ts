import { ServiceRepository } from '../repositories/service.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { NotFoundError, ForbiddenError } from '../utils/errors';

export class ServiceService {
  static async list(companyId: string, params: { page?: number; limit?: number }) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company not found');
    return ServiceRepository.findAll(companyId, params);
  }

  static async getById(serviceId: string) {
    const service = await ServiceRepository.findById(serviceId);
    if (!service) throw new NotFoundError('Service not found');
    return service;
  }

  static async create(companyId: string, userId: string, userRole: string, data: any) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company not found');

    if (userRole !== 'SUPER_ADMIN' && userRole !== 'COMPANY_ADMIN') {
      throw new ForbiddenError('Only company admins can create services');
    }

    const { companyId: _, ...cleanData } = data;
    return ServiceRepository.create({ ...cleanData, company: { connect: { id: companyId } } });
  }

  static async update(serviceId: string, companyId: string, userId: string, userRole: string, data: any) {
    const service = await ServiceRepository.findById(serviceId);
    if (!service || service.companyId !== companyId) throw new NotFoundError('Service not found');

    if (userRole !== 'SUPER_ADMIN' && userRole !== 'COMPANY_ADMIN') {
      throw new ForbiddenError('Only company admins can update services');
    }

    const { companyId: _, ...cleanData } = data;
    return ServiceRepository.update(serviceId, cleanData);
  }

  static async delete(serviceId: string, companyId: string, userId: string, userRole: string) {
    const service = await ServiceRepository.findById(serviceId);
    if (!service || service.companyId !== companyId) throw new NotFoundError('Service not found');

    if (userRole !== 'SUPER_ADMIN' && userRole !== 'COMPANY_ADMIN') {
      throw new ForbiddenError('Only company admins can delete services');
    }

    return ServiceRepository.delete(serviceId);
  }
}
