import { type CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { type GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { type UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ClassRepository } from '@/domain/repositories/class/class-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class ClassRepoImpl implements ClassRepository {
  async getClassListInfo(request: GetClassRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.class.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch Class info');
    }
  }

  async getClassById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.class.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch Class info');
    }
  }

  async createClass(request: CreateClassRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.class.create, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create Class');
    }
  }

  async updateClass(request: UpdateClassRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await apiClient.put<ApiResponse>(apiEndpoints.class.update, formData, {
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
      throw new Error(error?.message || 'Failed to fetch Class info');
    }
  }
}
