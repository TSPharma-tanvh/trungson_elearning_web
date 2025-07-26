import { type CategoryDetailResponse } from './category-detail-response';

export interface CategoryListResult {
  categories: CategoryDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
