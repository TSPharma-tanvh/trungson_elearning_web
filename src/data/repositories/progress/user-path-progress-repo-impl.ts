import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserPathProgressRequest } from '@/domain/models/user-path/request/create-user-path-progress-request';
import { EnrollUserListToPathRequest } from '@/domain/models/user-path/request/enroll-user-list-to-path-request';
import { GetUserPathProgressRequest } from '@/domain/models/user-path/request/get-user-path-progress-request';
import { UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { UserPathProgressRepository } from '@/domain/repositories/progress/user-path-progress-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserPathProgressRepoImpl implements UserPathProgressRepository {
  async getUserPathProgressListInfo(request: GetUserPathProgressRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.userPathProgress.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userPathProgress info');
    }
  }

  async getUserPathProgressById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.userPathProgress.getById(id));
      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userPathProgress info');
    }
  }

  async createUserPathProgress(request: CreateUserPathProgressRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.userPathProgress.create, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create userPathProgress');
    }
  }

  async updateUserPathProgress(request: UpdateUserPathProgressRequest): Promise<ApiResponse> {
    try {
      const formData = request.toJSON();

      const response = await apiClient.put<ApiResponse>(apiEndpoints.userPathProgress.update, formData);

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userPathProgress info');
    }
  }

  async enrollUserListToPath(request: EnrollUserListToPathRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.userPathProgress.enroll, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create userPathProgress');
    }
  }
}
