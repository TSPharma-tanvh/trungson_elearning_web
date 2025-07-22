import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';

export interface UserLessonProgressRepository {
  getUserLessonProgressListInfo(request: GetUserLessonProgressRequest): Promise<ApiPaginationResponse>;

  getUserLessonProgressById(id: string): Promise<ApiResponse>;

  createUserLessonProgress(request: CreateUserLessonRequest): Promise<ApiResponse>;

  updateUserLessonProgress(request: UpdateUserLessonRequest): Promise<ApiResponse>;
}
