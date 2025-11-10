import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateCourseRequest } from '@/domain/models/courses/request/create-course-request';
import { type GetCourseRequest } from '@/domain/models/courses/request/get-course-request';
import { type UpdateCourseRequest } from '@/domain/models/courses/request/update-course-request';

export interface CourseRepository {
  getCourseListInfo: (request: GetCourseRequest) => Promise<ApiPaginationResponse>;

  getCourseById: (id: string) => Promise<ApiResponse>;

  createCourse: (request: CreateCourseRequest) => Promise<ApiResponse>;

  updateCourse: (request: UpdateCourseRequest) => Promise<ApiResponse>;

  deleteCourse: (id: string) => Promise<ApiResponse>;
}
