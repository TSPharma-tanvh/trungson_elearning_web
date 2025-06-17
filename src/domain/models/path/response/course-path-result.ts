import { CoursePathResponse } from './course-path-response';

export interface CoursePathResult {
  path: CoursePathResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
