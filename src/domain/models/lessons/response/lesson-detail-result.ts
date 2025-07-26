import { type LessonDetailResponse } from './lesson-detail-response';

export interface LessonDetailListResult {
  Lessons: LessonDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
