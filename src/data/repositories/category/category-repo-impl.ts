import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { CategoryRepository } from '@/domain/repositories/category/category-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class CategoryRepositoryImpl implements CategoryRepository {
  async getCategoryListInfo(request: GetCategoryRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.category.getAll, {
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
