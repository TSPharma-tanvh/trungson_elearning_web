import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { type GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { type QuestionRepository } from '@/domain/repositories/question/question-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class QuestionRepoImpl implements QuestionRepository {
  async getQuestionListInfo(request: GetQuestionRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.questions.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch question info');
    }
  }

  async getQuestionById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.questions.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch question info');
    }
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.questions.create, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create question');
    }
  }

  async updateQuestion(request: UpdateQuestionRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.questions.update, formData, {
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
      throw new Error(error?.message || 'Failed to fetch question info');
    }
  }
}
