import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserCourseProgressRequest } from '@/domain/models/user-course/request/create-user-course-progress-request';
import { EnrollUserListToCourseRequest } from '@/domain/models/user-course/request/enroll-user-list-to-course';
import { GetUserCourseProgressRequest } from '@/domain/models/user-course/request/get-user-course-progress-request';
import { UpdateUserCourseProgressRequest } from '@/domain/models/user-course/request/update-user-course-progress-request';

export interface UserCourseProgressRepository {
  getUserCourseProgressListInfo(request: GetUserCourseProgressRequest): Promise<ApiPaginationResponse>;

  getUserCourseProgressById(id: string): Promise<ApiResponse>;

  createUserCourseProgress(request: CreateUserCourseProgressRequest): Promise<ApiResponse>;

  updateUserCourseProgress(request: UpdateUserCourseProgressRequest): Promise<ApiResponse>;

  enrollUserListToCourse(request: EnrollUserListToCourseRequest): Promise<ApiResponse>;
}
