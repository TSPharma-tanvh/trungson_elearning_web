import { CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';

export interface CategoryRepository {
  getCategoryListInfo(request: GetCategoryRequest): Promise<ApiPaginationResponse>;

  getCategoryById(id: string): Promise<ApiResponse>;

  createCategory(request: CreateCategoryRequest): Promise<ApiResponse>;

  updateCategory(request: UpdateCategoryRequest): Promise<ApiResponse>;
}
