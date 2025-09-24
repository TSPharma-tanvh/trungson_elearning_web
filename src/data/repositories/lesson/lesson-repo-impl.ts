import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { type GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonRepository } from '@/domain/repositories/lessons/lesson-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class LessonRepoImpl implements LessonRepository {
  async getLessonListInfo(request: GetLessonRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.lessons.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch lesson info');
    }
  }

  async getLessonById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.lessons.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch lesson info');
    }
  }

  async createLesson(request: CreateLessonRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.lessons.create, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create lesson');
    }
  }

  async updateLesson(
    request: UpdateLessonRequest,
    options?: { suppressSuccessMessage?: boolean }
  ): Promise<ApiResponse> {
    try {
      const response = await customApiClient.put<ApiResponse>(apiEndpoints.lessons.update, request.toFormData(), {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 10800000,
        suppressSuccessMessage: options?.suppressSuccessMessage ?? false,
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Failed to update lesson');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update lesson');
    }
  }
}
