import { CreateLessonRequest } from '@/domain/lessons/request/create-lesson-request';
import { GetLessonRequest } from '@/domain/lessons/request/get-lesson-request';
import { UpdateLessonRequest } from '@/domain/lessons/request/update-lesson-request';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';

export interface LessonRepository {
  getLessonListInfo(request: GetLessonRequest): Promise<ApiPaginationResponse>;

  getLessonById(id: string): Promise<ApiResponse>;

  createLesson(request: CreateLessonRequest): Promise<ApiResponse>;

  updateLesson(request: UpdateLessonRequest): Promise<ApiResponse>;
}
