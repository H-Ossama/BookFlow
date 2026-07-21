import bcrypt from 'bcryptjs';
import { EmployeeRepository, WorkingHoursRepository, VacationDayRepository } from '../repositories/employee.repository';
import { AuthRepository } from '../repositories/auth.repository';
import { CompanyRepository } from '../repositories/company.repository';
import { NotFoundError, ConflictError, ForbiddenError } from '../utils/errors';

export class EmployeeService {
  static async list(companyId: string) {
    const company = await CompanyRepository.findById(companyId);
    if (!company) throw new NotFoundError('Company not found');
    return EmployeeRepository.findAll(companyId);
  }

  static async getById(employeeId: string, companyId: string) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return employee;
  }

  static async create(companyId: string, requesterRole: string, data: { email: string; firstName: string; lastName: string; phone?: string; bio?: string; specialties?: string[]; companyRoleId?: string }) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only company admins can add employees');
    }

    const existingUser = await AuthRepository.findByEmail(data.email);
    if (existingUser) {
      const existingEmployee = await EmployeeRepository.findByUserId(existingUser.id);
      if (existingEmployee) {
        throw new ConflictError('This user is already an employee');
      }
      if (data.companyRoleId) {
        await AuthRepository.updateUser(existingUser.id, { companyRoleId: data.companyRoleId });
      }
      return EmployeeRepository.create({
        user: { connect: { id: existingUser.id } },
        company: { connect: { id: companyId } },
        bio: data.bio,
        specialties: data.specialties || [],
      });
    }

    // Create new user + employee
    const tempPassword = Math.random().toString(36).slice(-10);
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const newUser = await AuthRepository.createUser({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      role: 'EMPLOYEE',
      emailVerified: false,
      companyRoleId: data.companyRoleId || null,
    });

    const employee = await EmployeeRepository.create({
      user: { connect: { id: newUser.id } },
      company: { connect: { id: companyId } },
      bio: data.bio,
      specialties: data.specialties || [],
    });

    return { employee, tempPassword };
  }

  static async update(employeeId: string, companyId: string, requesterRole: string, data: any) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only company admins can update employees');
    }
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');

    // Update user-level fields (firstName, lastName, phone, companyRoleId)
    const userFields: Record<string, any> = {};
    if (data.firstName !== undefined) userFields.firstName = data.firstName;
    if (data.lastName !== undefined) userFields.lastName = data.lastName;
    if (data.phone !== undefined) userFields.phone = data.phone;
    if (data.companyRoleId !== undefined) userFields.companyRoleId = data.companyRoleId;

    if (Object.keys(userFields).length > 0) {
      await AuthRepository.updateUser(employee.userId, userFields);
    }

    // Update employee-level fields
    const employeeData: Record<string, any> = {};
    if (data.bio !== undefined) employeeData.bio = data.bio;
    if (data.specialties !== undefined) employeeData.specialties = data.specialties;
    if (data.isActive !== undefined) employeeData.isActive = data.isActive;

    return EmployeeRepository.update(employeeId, employeeData);
  }

  static async delete(employeeId: string, companyId: string, requesterRole: string) {
    if (requesterRole !== 'COMPANY_ADMIN' && requesterRole !== 'SUPER_ADMIN') {
      throw new ForbiddenError('Only company admins can remove employees');
    }
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return EmployeeRepository.delete(employeeId);
  }

  // Working Hours
  static async setWorkingHours(employeeId: string, companyId: string, schedules: { dayOfWeek: number; startTime: string; endTime: string; isActive?: boolean }[]) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return WorkingHoursRepository.setForEmployee(employeeId, schedules);
  }

  static async getWorkingHours(employeeId: string, companyId: string) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return WorkingHoursRepository.findByEmployee(employeeId);
  }

  // Vacation Days
  static async addVacationDay(employeeId: string, companyId: string, data: { date: string; reason?: string }) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return VacationDayRepository.create(employeeId, data);
  }

  static async removeVacationDay(vacationId: string, employeeId: string, companyId: string) {
    const employee = await EmployeeRepository.findById(employeeId);
    if (!employee || employee.companyId !== companyId) throw new NotFoundError('Employee not found');
    return VacationDayRepository.delete(vacationId);
  }
}
