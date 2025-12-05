import { type LessonDetailResponse } from './lesson-detail-response';

export interface LessonDetailListResult {
  lessons: LessonDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
