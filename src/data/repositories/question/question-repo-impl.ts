import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { QuestionRepository } from '@/domain/repositories/question/question-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class QuestionRepoImpl implements QuestionRepository {
  async getQuestionListInfo(request: GetQuestionRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.questions.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async getQuestionById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.questions.getById(id));
      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse> {
    try {
      const response = await apiClient.post<ApiResponse>(apiEndpoints.questions.create, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create course');
    }
  }

  async updateQuestion(request: UpdateQuestionRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await apiClient.put<ApiResponse>(apiEndpoints.questions.update, formData, {
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
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }
}
