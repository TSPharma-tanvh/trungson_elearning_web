import { type ApiResponse } from '@/domain/models/core/api-response';
import { type UpdateUserAnswerRequest } from '@/domain/models/user-answer/request/update-user-answer-request';
import { type UserAnswerRepository } from '@/domain/repositories/progress/user-answer-progress-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class UserAnswerRepoImpl implements UserAnswerRepository {
  async updateUserAnswer(request: UpdateUserAnswerRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.put<ApiResponse>(apiEndpoints.userAnswerProgress.update, request.toJson());

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
