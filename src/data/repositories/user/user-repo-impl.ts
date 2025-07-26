import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { type GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { type UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserRepository } from '@/domain/repositories/user/user-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserRepositoryImpl implements UserRepository {
  async getUserDetailInfo(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.user.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await apiClient.put<ApiResponse>(apiEndpoints.user.update(id), formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 3600000,
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async getUserListInfo(request: GetUserRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.user.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async registerUser(request: RegisterRequestModel): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.identity.signUp, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to register user');
    }
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.identity.changePassword, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to register user');
    }
  }
}
