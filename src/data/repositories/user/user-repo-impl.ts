import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetUserRequest, getUserRequestToJSON } from '@/domain/models/user/request/get-user-request';
import { RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserRepository } from '@/domain/repositories/user/user-repository';

import { apiClient } from '@/data/api/apiClient';
import { apiEndpoints, getApiUrl } from '@/data/api/apiEndpoints';

export class UserRepositoryImpl implements UserRepository {
  async getUserDetailInfo(id: string): Promise<ApiResponse> {
    const url = getApiUrl(apiEndpoints.user.getById, id);
    try {
      const response = await apiClient.get<ApiResponse>(url);
      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse> {
    const url = getApiUrl(apiEndpoints.user.update, id);
    try {
      const formData = request.toFormData();

      const response = await apiClient.put<ApiResponse>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async getUserListInfo(request: GetUserRequest): Promise<ApiPaginationResponse> {
    const url = getApiUrl(apiEndpoints.user.getAll);
    try {
      const response = await apiClient.get<ApiPaginationResponse>(url, {
        params: getUserRequestToJSON(request),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }

  async registerUser(request: RegisterRequestModel): Promise<ApiResponse> {
    const url = getApiUrl(apiEndpoints.identity.signUp);

    try {
      const response = await apiClient.post<ApiResponse>(url, request.toJSON());

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to register user');
    }
  }
}
