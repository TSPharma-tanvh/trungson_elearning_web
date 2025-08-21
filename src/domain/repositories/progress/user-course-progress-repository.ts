import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserCourseProgressRequest } from '@/domain/models/user-course/request/create-user-course-progress-request';
import { type EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { type GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { type UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';

export interface UserCourseProgressRepository {
  getUserCourseProgressListInfo: (request: GetUserCourseProgressRequest) => Promise<ApiPaginationResponse>;

  getUserCourseProgressById: (id: string) => Promise<ApiResponse>;

  createUserCourseProgress: (request: CreateUserCourseProgressRequest) => Promise<ApiResponse>;

  updateUserCourseProgress: (request: UpdateUserCourseProgressRequest) => Promise<ApiResponse>;

  deleteUserCourseProgress: (id: string) => Promise<ApiResponse>;

  enrollUserListToCourse: (request: EnrollUserListToCourseRequest) => Promise<ApiResponse>;
}
