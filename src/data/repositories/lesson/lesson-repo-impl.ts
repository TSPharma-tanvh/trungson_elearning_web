import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { type GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';
import { type LessonRepository } from '@/domain/repositories/lessons/lesson-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class LessonRepoImpl implements LessonRepository {
  async getLessonListInfo(request: GetLessonRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.lessons.getAll, {
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
      const response = await apiClient.get<ApiResponse>(apiEndpoints.lessons.getById(id));
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
      const response = await apiClient.post<ApiResponse>(apiEndpoints.lessons.create, request.toFormData(), {
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

  async updateLesson(request: UpdateLessonRequest, onProgress?: (progress: number) => void): Promise<ApiResponse> {
    try {
      if (request.videoChunk && request.videoChunk instanceof File) {
        const chunkSize = 5 * 1024 * 1024;
        const totalChunks = Math.ceil(request.videoChunk.size / chunkSize);
        const videoId = request.videoID;
        let lastResponse: ApiResponse | null = null;

        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * chunkSize;
          const end = Math.min(start + chunkSize, request.videoChunk.size);
          const chunk = request.videoChunk.slice(start, end);
          // Use the original video filename for all chunks
          const chunkFile = new File([chunk], request.videoChunk.name, { type: 'video/mp4' });

          const isLastChunk = chunkIndex === totalChunks - 1;

          const chunkRequest = new UpdateLessonRequest({
            ...request,
            videoChunk: chunkFile,
            chunkIndex,
            totalChunks,
            videoID: videoId,
          });

          const formData = chunkRequest.toFormData();

          const response = await apiClient.put<ApiResponse>(apiEndpoints.lessons.update, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            timeout: 10800000,
          });

          const apiResponse = response.data;

          if (!apiResponse?.isSuccessStatusCode) {
            throw new Error(apiResponse?.message || `Chunk ${chunkIndex} upload failed`);
          }

          if (onProgress) {
            onProgress(((chunkIndex + 1) / totalChunks) * 100);
          }

          lastResponse = apiResponse;
        }

        return lastResponse!;
      }

      const response = await apiClient.put<ApiResponse>(apiEndpoints.lessons.update, request.toFormData(), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update lesson');
    }
  }
}
