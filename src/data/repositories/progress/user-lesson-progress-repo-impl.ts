import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { type GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { type UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { type UserLessonProgressRepository } from '@/domain/repositories/progress/user-lesson-progress-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserLessonProgressRepoImpl implements UserLessonProgressRepository {
  async getUserLessonProgressListInfo(request: GetUserLessonProgressRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.userLessonProgress.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userLessonProgress info');
    }
  }

  async getUserLessonProgressById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.userLessonProgress.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userLessonProgress info');
    }
  }

  async createUserLessonProgress(request: CreateUserLessonRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(
        apiEndpoints.userLessonProgress.create,
        request.toJson()
      );

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create userLessonProgress');
    }
  }

  async updateUserLessonProgress(request: UpdateUserLessonRequest): Promise<ApiResponse> {
    try {
      const formData = request.toJson();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.userLessonProgress.update, formData);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userLessonProgress info');
    }
  }
}
