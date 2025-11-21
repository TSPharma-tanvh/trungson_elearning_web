import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { type GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { type QuizRepository } from '@/domain/repositories/quiz/quiz-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class QuizRepoImpl implements QuizRepository {
  async getQuizListInfo(request: GetQuizRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.quiz.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch quiz info');
    }
  }

  async getQuizById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.quiz.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch quiz info');
    }
  }

  async createQuiz(request: CreateQuizRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.quiz.createDetail, request.toFormData(), {
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
      throw new Error(error?.message || 'Failed to create quiz');
    }
  }

  // async createQuizFromExcel(request: CreateQuizFromExcelRequest): Promise<ApiResponse> {
  //   try {
  //     const response = await customApiClient.post<ApiResponse>(apiEndpoints.quiz.createByExcel, request.toFormData(), {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       timeout: 3600000,
  //     });

  //     const apiResponse = response.data;

  //     if (!apiResponse?.isSuccessStatusCode) {
  //       throw new Error(apiResponse?.message || 'Unknown API error');
  //     }

  //     return apiResponse;
  //   } catch (error: any) {
  //     throw new Error(error?.message || 'Failed to create quiz');
  //   }
  // }

  async updateQuiz(request: UpdateQuizRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.quiz.update, formData, {
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
      throw new Error(error?.message || 'Failed to fetch quiz info');
    }
  }
}
