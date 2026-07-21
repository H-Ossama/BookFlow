import { CompanyRoleRepository } from '../repositories/company-role.repository';
import { NotFoundError, ConflictError } from '../utils/errors';

export class CompanyRoleService {
  static async list(companyId: string) {
    return CompanyRoleRepository.findAll(companyId);
  }

  static async getById(id: string, companyId: string) {
    const role = await CompanyRoleRepository.findById(id);
    if (!role || role.companyId !== companyId) throw new NotFoundError('Role not found');
    return role;
  }

  static async create(companyId: string, data: { name: string; description?: string; permissions: string[] }) {
    const existing = await CompanyRoleRepository.findAll(companyId);
    if (existing.some((r) => r.name.toLowerCase() === data.name.toLowerCase())) {
      throw new ConflictError('A role with this name already exists');
    }
    return CompanyRoleRepository.create(companyId, data);
  }

  static async update(id: string, companyId: string, data: { name?: string; description?: string; permissions?: string[] }) {
    const role = await CompanyRoleRepository.findById(id);
    if (!role || role.companyId !== companyId) throw new NotFoundError('Role not found');

    if (role.isDefault) {
      throw new ConflictError('Default roles cannot be modified');
    }

    if (data.name) {
      const existing = await CompanyRoleRepository.findAll(companyId);
      if (existing.some((r) => r.id !== id && r.name.toLowerCase() === data.name!.toLowerCase())) {
        throw new ConflictError('A role with this name already exists');
      }
    }

    return CompanyRoleRepository.update(id, data);
  }

  static async delete(id: string, companyId: string) {
    const role = await CompanyRoleRepository.findById(id);
    if (!role || role.companyId !== companyId) throw new NotFoundError('Role not found');
    if (role.isDefault) throw new ConflictError('Default roles cannot be deleted');
    return CompanyRoleRepository.delete(id);
  }
}
