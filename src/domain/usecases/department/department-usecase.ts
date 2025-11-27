import { type ApiResponse } from '@/domain/models/core/api-response';
import { type SyncDepartmentFromHrmRequest } from '@/domain/models/department/request/sync-department-from-hrm-request';
import { type DepartmentRepository } from '@/domain/repositories/department/department-repository';

export class DepartmentUsecase {
  constructor(private readonly courseRepo: DepartmentRepository) {}

  // async getDepartmentListInfo(request: GetDepartmentRequest): Promise<DepartmentListResult> {
  //   const result = await this.courseRepo.getDepartmentListInfo(request);

  //   if (!result || !Array.isArray(result.result)) {
  //     throw new Error('Failed to load user list.');
  //   }

  //   const data = result.result.map((x) => DepartmentResponse.fromJson(x));

  //   return {
  //     employees: data,
  //     totalRecords: result.totalRecords ?? result.result.length,
  //     pageSize: result.pageSize ?? request.pageSize,
  //     pageNumber: result.pageNumber ?? request.pageNumber,
  //   };
  // }

  // async getDepartmentById(id: string): Promise<DepartmentResponse> {
  //   if (id === null || id === undefined || id.trim() === '') {
  //     throw new Error('ID is missing.');
  //   }

  //   const result = await this.courseRepo.getDepartmentById(id);

  //   const userResponse = DepartmentResponse.fromJson(result.result);

  //   return userResponse;
  // }

  // async getDepartmentFromHrm(request: GetDepartmentFromHrmRequest): Promise<ApiResponse> {
  //   const response = await this.courseRepo.getDepartmentFromHrm(request);

  //   return response;
  // }

  async syncDepartmentFromHrm(request: SyncDepartmentFromHrmRequest): Promise<ApiResponse> {
    const result = await this.courseRepo.syncDepartmentFromHrm(request);

    return result;
  }

  // async deleteDepartment(id: string): Promise<ApiResponse> {
  //   if (id === null || id === undefined || id.trim() === '') {
  //     throw new Error('ID is missing.');
  //   }

  //   const result = await this.courseRepo.deleteDepartment(id);

  //   return result;
  // }
}
