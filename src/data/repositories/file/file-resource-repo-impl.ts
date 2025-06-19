import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { FileResourceRepository } from '@/domain/repositories/file/file-resources-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class FileResourceRepositoryImpl implements FileResourceRepository {
  async getFileResourceList(request: GetFileResourcesRequest): Promise<ApiPaginationResponse> {
    const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.fileResources.getAll, {
      params: request.toJson(),
    });

    const apiResponse = response.data;

    if (!apiResponse || !apiResponse.isSuccessStatusCode) {
      throw new Error(apiResponse?.message || 'Unknown API error');
    }

    return apiResponse;
  }
  catch(error: any) {
    throw new Error(error?.message || 'Failed to fetch user info');
  }

  async getFileResouceById(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.get<ApiResponse>(apiEndpoints.fileResources.getById(id));
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
