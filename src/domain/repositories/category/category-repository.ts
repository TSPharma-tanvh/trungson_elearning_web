import { type CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { type GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';

export interface CategoryRepository {
  getCategoryListInfo: (request: GetCategoryRequest) => Promise<ApiPaginationResponse>;

  getQuestionCategoryListInfo: (request: GetCategoryRequest) => Promise<ApiPaginationResponse>;

  getCategoryById: (id: string) => Promise<ApiResponse>;

  createCategory: (request: CreateCategoryRequest) => Promise<ApiResponse>;

  updateCategory: (request: UpdateCategoryRequest) => Promise<ApiResponse>;

  deleteCategory: (id: string) => Promise<ApiResponse>;
}
