import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetEmployeeFromHrmRequest } from '@/domain/models/employee/request/get-employee-from-hrm-request';
import { type GetEmployeeRequest } from '@/domain/models/employee/request/get-employee-request';
import { type SyncEmployeeFromHrmRequest } from '@/domain/models/employee/request/sync-employee-from-hrm-request';
import { type EmployeeRepository } from '@/domain/repositories/employee/employee-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class EmployeeRepoImpl implements EmployeeRepository {
  async getEmployeeListInfo(request: GetEmployeeRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.employee.getAll, {
        params: request.toJson(),
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

  async getEmployeeById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.employee.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async getEmployeeFromHrm(request: GetEmployeeFromHrmRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.employee.getHrm, {
        params: request.toJson(),
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

  async syncEmployeeFromHrm(request: SyncEmployeeFromHrmRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.employee.syncHrm, {
        params: request.toJson(),
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

  async deleteEmployee(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(apiEndpoints.employee.delete(id));
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
