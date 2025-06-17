import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';

export interface CategoryRepository {
  getCategoryListInfo(request: GetCategoryRequest): Promise<ApiPaginationResponse>;
}
