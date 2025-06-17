import { CategoryResponse } from './category-response';

export interface CategoryListResult {
  categories: CategoryResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
