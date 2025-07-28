import { type CreateCategoryRequest } from '@/domain/models/category/request/create-category-request';
import { type GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { type UpdateCategoryRequest } from '@/domain/models/category/request/update-category-request';
import { CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { type CategoryListResult } from '@/domain/models/category/response/category-result';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CategoryRepository } from '@/domain/repositories/category/category-repository';

export class CategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  async getCategoryList(request: GetCategoryRequest): Promise<CategoryListResult> {
    const result = await this.categoryRepo.getCategoryListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => CategoryDetailResponse.fromJson(x));

    return {
      categories: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getCategoryById(id: string): Promise<CategoryDetailResponse> {
    const result = await this.categoryRepo.getCategoryById(id);

    const userResponse = CategoryDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createCategory(request: CreateCategoryRequest): Promise<ApiResponse> {
    const response = await this.categoryRepo.createCategory(request);

    return response;
  }

  async updateCategory(request: UpdateCategoryRequest): Promise<ApiResponse> {
    const result = await this.categoryRepo.updateCategory(request);

    return result;
  }

  async deleteCategory(id: string): Promise<ApiResponse> {
    const result = await this.categoryRepo.deleteCategory(id);

    return result;
  }
}
