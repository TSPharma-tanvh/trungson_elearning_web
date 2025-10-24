import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserCourseProgressRequest } from '@/domain/models/user-course/request/create-user-course-progress-request';
import { type EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { type GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { type UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';
import { type UserCourseProgressRepository } from '@/domain/repositories/progress/user-course-progress-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserCourseProgressRepoImpl implements UserCourseProgressRepository {
  async getUserCourseProgressListInfo(request: GetUserCourseProgressRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.userCourseProgress.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userCourseProgress info');
    }
  }

  async getUserCourseProgressById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.userCourseProgress.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userCourseProgress info');
    }
  }

  async createUserCourseProgress(request: CreateUserCourseProgressRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(
        apiEndpoints.userCourseProgress.create,
        request.toJson()
      );

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create userCourseProgress');
    }
  }

  async updateUserCourseProgress(request: UpdateUserCourseProgressRequest): Promise<ApiResponse> {
    try {
      const formData = request.toJson();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.userCourseProgress.update, formData);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userCourseProgress info');
    }
  }

  async deleteUserCourseProgress(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.userCourseProgress.delete(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch userCourseProgress info');
    }
  }

  async enrollUserListToCourse(request: EnrollUserListToCourseRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(
        apiEndpoints.userCourseProgress.enroll,
        request.toFormData(),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: 3600000,
        }
      );

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create userCourseProgress');
    }
  }
}
