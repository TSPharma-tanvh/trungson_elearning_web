import { type UserQuizProgressDetailResponse } from './user-quiz-progress-detail-response';

export interface UserQuizProgressDetailListResult {
  progress: UserQuizProgressDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
