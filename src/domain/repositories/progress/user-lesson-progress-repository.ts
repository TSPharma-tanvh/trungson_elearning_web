import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { EnrollUserListToLessonRequest } from '@/domain/models/user-lesson/request/enroll-user-to-lesson-request';
import { type GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { type UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';

export interface UserLessonProgressRepository {
  getUserLessonProgressListInfo: (request: GetUserLessonProgressRequest) => Promise<ApiPaginationResponse>;

  getUserLessonProgressById: (id: string) => Promise<ApiResponse>;

  createUserLessonProgress: (request: CreateUserLessonRequest) => Promise<ApiResponse>;

  enrollUserListToLesson: (request: EnrollUserListToLessonRequest) => Promise<ApiResponse>;

  updateUserLessonProgress: (request: UpdateUserLessonRequest) => Promise<ApiResponse>;

  deleteUserLesson(id: string): Promise<ApiResponse>;
}
