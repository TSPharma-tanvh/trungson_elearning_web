import { ApiResponse } from '@/domain/models/core/api-response';
import { GetEmployeeFromHrmRequest } from '@/domain/models/employee/request/get-employee-from-hrm-request';
import { GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';
import { EmployeeResponse } from '@/domain/models/employee/response/employee-response';
import { EmployeeListResult } from '@/domain/models/employee/response/employee-result';
import { EmployeeRepository } from '@/domain/repositories/employee/employee-repository';
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

    var result = await this.courseRepo.getEmployeeById(id);

    var userResponse = EmployeeResponse.fromJSON(result.result);

    return userResponse;
  }

  async getEmployeeFromHrm(request: GetEmployeeFromHrmRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.getEmployeeFromHrm(request);

    return response;
  }

  async syncEmployeeFromHrm(request: SyncEmployeeFromHrmRequest): Promise<ApiResponse> {
    var result = await this.courseRepo.syncEmployeeFromHrm(request);

    return result;
  }

  async deleteEmployee(id: string): Promise<ApiResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.courseRepo.deleteEmployee(id);

    return result;
  }
}
