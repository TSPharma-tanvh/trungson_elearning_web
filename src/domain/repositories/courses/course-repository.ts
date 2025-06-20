import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';

export interface CourseRepository {
  getCourseListInfo(request: GetCourseRequest): Promise<ApiPaginationResponse>;

  getCourseById(id: string): Promise<ApiResponse>;

  createCourse(request: CreateCourseRequest): Promise<ApiResponse>;

  updateCourse(request: UpdateCourseRequest): Promise<ApiResponse>;
}
