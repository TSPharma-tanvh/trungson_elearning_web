import { type CreateAnswerRequest } from '@/domain/models/answer/request/create-answer-request';
import { type GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { type UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type AnswerRepository } from '@/domain/repositories/answer/answer-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class AnswerRepoImpl implements AnswerRepository {
  async getAnswerListInfo(request: GetAnswerRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.answers.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async getAnswerById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.answers.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }

  async createAnswer(request: CreateAnswerRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.answers.create, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create course');
    }
  }

  async updateAnswer(request: UpdateAnswerRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.answers.update, formData, {
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
      throw new Error(error?.message || 'Failed to fetch course info');
    }
  }
}
