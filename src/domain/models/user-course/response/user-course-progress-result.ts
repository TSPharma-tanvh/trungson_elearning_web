import { type UserCourseProgressResponse } from './user-course-progress-response';

export interface UserCourseProgressResult {
  courses: UserCourseProgressResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
