import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { GetRoleRequest } from '@/domain/models/role/request/get-role-request';
import { RoleRepository } from '@/domain/repositories/role/role-repository';

import { apiClient } from '@/data/api/apiClient';
import { apiEndpoints, getApiUrl } from '@/data/api/apiEndpoints';

export class RoleRepositoryImpl implements RoleRepository {
  async getAllRoles(request: GetRoleRequest): Promise<ApiPaginationResponse> {
    const url = getApiUrl(apiEndpoints.role.getAll);
    try {
      const response = await apiClient.get<ApiPaginationResponse>(url, {
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
}
