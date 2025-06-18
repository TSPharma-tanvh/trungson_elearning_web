import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { CourseRepository } from '@/domain/repositories/courses/course-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class CourseRepoImpl implements CourseRepository {
  async getCourseListInfo(request: GetCourseRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.courses.getAll, {
        params: request.toJSON(),
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
