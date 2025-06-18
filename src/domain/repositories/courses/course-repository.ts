import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';

export interface CourseRepository {
  getCourseListInfo(request: GetCourseRequest): Promise<ApiPaginationResponse>;
}
