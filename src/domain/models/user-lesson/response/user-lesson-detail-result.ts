import { UserLessonProgressDetailResponse } from './user-lesson-detail-response';

export interface UserLessonProgressDetailListResult {
  progress: UserLessonProgressDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
