import { ApiResponse } from '@/domain/models/core/api-response';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserRepository } from '@/domain/repositories/user/user-repository';

import { apiClient } from '@/data/api/apiClient';
import { apiEndpoints } from '@/data/api/apiEndpoints';

export class UserRepositoryImpl implements UserRepository {
  async getUserDetailInfo(id: string): Promise<ApiResponse> {
    const url = apiEndpoints.user.getById(id);

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
    const url = apiEndpoints.user.update(id);

    try {
      const formData = request.toFormData();

      // console.error('FormData contents:');
      // formData.forEach((value, key) => {
      //   console.error(`${key}:`, value);
      // });

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
}
