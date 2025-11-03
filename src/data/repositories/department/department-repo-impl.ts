import { type ApiResponse } from '@/domain/models/core/api-response';
import { SyncDepartmentFromHrmRequest } from '@/domain/models/department/request/sync-department-from-hrm-request';
import { DepartmentRepository } from '@/domain/repositories/department/department-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class DepartmentRepoImpl implements DepartmentRepository {
  // async getDepartmentListInfo(request: GetDepartmentRequest): Promise<ApiPaginationResponse> {
  //   try {
  //     const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.employee.getAll, {
  //       params: request.toJson(),
  //     });

  //     const apiResponse = response.data;

  //     if (!apiResponse?.isSuccessStatusCode) {
  //       throw new Error(apiResponse?.message || 'Unknown API error');
  //     }

  //     return apiResponse;
  //   } catch (error: any) {
  //     throw new Error(error?.message || 'Failed to fetch course info');
  //   }
  // }

  // async getDepartmentById(id: string): Promise<ApiResponse> {
  //   try {
  //     const response = await customApiClient.get<ApiResponse>(apiEndpoints.employee.getById(id));
  //     const apiResponse = response.data;

  //     if (!apiResponse?.isSuccessStatusCode) {
  //       throw new Error(apiResponse?.message || 'Unknown API error');
  //     }

  //     return apiResponse;
  //   } catch (error: any) {
  //     throw new Error(error?.message || 'Failed to fetch course info');
  //   }
  // }

  // async getDepartmentFromHrm(request: GetDepartmentFromHrmRequest): Promise<ApiResponse> {
  //   try {
  //     const response = await customApiClient.post<ApiResponse>(apiEndpoints.employee.getHrm, {
  //       params: request.toJson(),
  //     });

  //     const apiResponse = response.data;

  //     if (!apiResponse?.isSuccessStatusCode) {
  //       throw new Error(apiResponse?.message || 'Unknown API error');
  //     }

  //     return apiResponse;
  //   } catch (error: any) {
  //     throw new Error(error?.message || 'Failed to fetch course info');
  //   }
  // }

  async syncDepartmentFromHrm(request: SyncDepartmentFromHrmRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.department.syncHrm, request.toJson(), {
        timeout: 3600000,
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async deleteDepartment(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.employee.delete(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }
}
