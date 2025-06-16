import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateRoleRequest } from '@/domain/models/role/request/create-role-request';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { UpdateRoleRequest } from '@/domain/models/role/request/update-role-request';
import { RoleRepository } from '@/domain/repositories/role/role-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class RoleRepositoryImpl implements RoleRepository {
  async getAllPermissions(): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.role.getPermissions);

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  }

  async getAllRoles(request: GetRoleRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.role.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  }

  async createRole(request: CreateRoleRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.role.createRole, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  }

  async updateRole(id: string, request: UpdateRoleRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.put<ApiResponse>(apiEndpoints.role.updateRole(id), request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  }

  async deleteRole(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete<ApiResponse>(apiEndpoints.role.deleteRole(id));

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch roles');
    }
  }
}
