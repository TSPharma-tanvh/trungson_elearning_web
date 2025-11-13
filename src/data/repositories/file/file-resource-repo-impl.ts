import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateFileResourcesRequest } from '@/domain/models/file/resquest/create-file-resource-request';
import { type GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { type UpdateFileResourcesRequest } from '@/domain/models/file/resquest/update-file-resource-request';
import { type FileResourceRepository } from '@/domain/repositories/file/file-resources-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class FileResourceRepositoryImpl implements FileResourceRepository {
  async getFileResourceList(request: GetFileResourcesRequest): Promise<ApiPaginationResponse> {
    const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.fileResources.getAll, {
      params: request.toJson(),
    });

    const apiResponse = response.data;

    if (!apiResponse?.isSuccessStatusCode) {
      throw new Error(apiResponse?.message || 'Unknown API error');
    }

    return apiResponse;
  }
  catch(error: any) {
    throw new Error(error?.message || 'Failed to fetch file info');
  }

  async getFileResourceById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.fileResources.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch file info');
    }
  }

  async createResource(request: CreateFileResourcesRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(
        apiEndpoints.fileResources.create,
        request.toFormData(),
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-suppress-success': 'true',
          },
          timeout: 10800000,
        }
      );

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create file');
    }
  }

  async updateResource(request: UpdateFileResourcesRequest): Promise<ApiResponse> {
    try {
      const formData = request.toFormData();

      const response = await customApiClient.put<ApiResponse>(apiEndpoints.fileResources.update, formData, {
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
      throw new Error(error?.message || 'Failed to update file');
    }
  }

  async deleteResource(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.fileResources.delete(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to delete file');
    }
  }
}
