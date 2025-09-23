import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { type GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';

export interface LessonRepository {
  getLessonListInfo: (request: GetLessonRequest) => Promise<ApiPaginationResponse>;

  getLessonById: (id: string) => Promise<ApiResponse>;

  createLesson: (request: CreateLessonRequest) => Promise<ApiResponse>;

  updateLesson: (request: UpdateLessonRequest, options?: { suppressSuccessMessage?: boolean }) => Promise<ApiResponse>;
}
