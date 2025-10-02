import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { type GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type CreateUsersFromExcelRequest } from '@/domain/models/user/request/import-user-request';
import { type RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { type UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { type UserRepository } from '@/domain/repositories/user/user-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserRepositoryImpl implements UserRepository {
  async getUserDetailInfo(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.user.getById(id));
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

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.user.update(id), formData, {
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
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.user.getAll, {
        params: request.toJson(),
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
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.identity.signUp, request.toJson());

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
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.identity.changePassword, request.toJson());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to register user');
    }
  }

  async importUsers(request: CreateUsersFromExcelRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.user.import, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create user');
    }
  }
}
