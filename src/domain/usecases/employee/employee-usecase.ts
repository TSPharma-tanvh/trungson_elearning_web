import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetEmployeeFromHrmRequest } from '@/domain/models/employee/request/get-employee-from-hrm-request';
import { type GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { type SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';
import { EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { type EmployeeListResult } from '@/domain/models/employee/response/employee-result';
import { type EmployeeRepository } from '@/domain/repositories/employee/employee-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class EmployeeUsecase {
  constructor(private readonly courseRepo: EmployeeRepository) {}

  async getEmployeeListInfo(request: GetEmployeeRequest): Promise<EmployeeListResult> {
    const result = await this.courseRepo.getEmployeeListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(EmployeeResponse.fromJSON);

    return {
      employees: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getEmployeeById(id: string): Promise<EmployeeResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.courseRepo.getEmployeeById(id);

    const userResponse = EmployeeResponse.fromJSON(result.result);

    return userResponse;
  }

  async getEmployeeFromHrm(request: GetEmployeeFromHrmRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.getEmployeeFromHrm(request);

    return response;
  }

  async syncEmployeeFromHrm(request: SyncEmployeeFromHrmRequest): Promise<ApiResponse> {
    const result = await this.courseRepo.syncEmployeeFromHrm(request);

    return result;
  }

  async deleteEmployee(id: string): Promise<ApiResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.courseRepo.deleteEmployee(id);

    return result;
  }
}
