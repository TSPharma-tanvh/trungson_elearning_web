import { type CourseDetailResponse } from './course-detail-response';

export interface CourseDetailListResult {
  courses: CourseDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
