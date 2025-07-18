import { UserPathProgressDetailResponse } from './user-path-progress-detail-response';

export interface UserPathProgressDetailListResult {
  progress: UserPathProgressDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
