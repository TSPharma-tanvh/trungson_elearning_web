import { GetCategoryRequest } from '@/domain/models/category/request/get-category-request';
import { CategoryDetailResponse } from '@/domain/models/category/response/category-detail-response';
import { CategoryResponse } from '@/domain/models/category/response/category-response';
import { CategoryListResult } from '@/domain/models/category/response/category-result';
import { CategoryRepository } from '@/domain/repositories/category/category-repository';

export class CategoryUsecase {
  constructor(private readonly categoryRepo: CategoryRepository) {}
  async getCategoryList(request: GetCategoryRequest): Promise<CategoryListResult> {
    const result = await this.categoryRepo.getCategoryListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(CategoryResponse.fromJSON);

    return {
      categories: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getCategoryById(id: string): Promise<CategoryDetailResponse> {
    var result = await this.categoryRepo.getCategoryById(id);

    var userResponse = CategoryDetailResponse.fromJson(result.result);

    return userResponse;
  }
}
