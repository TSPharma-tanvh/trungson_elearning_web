import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
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
    throw new Error(error?.message || 'Failed to fetch user info');
  }

  async getFileResouceById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.fileResources.getById(id));
      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }
}
