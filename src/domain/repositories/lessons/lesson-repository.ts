import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';

export interface LessonRepository {
  getLessonListInfo(request: GetLessonRequest): Promise<ApiPaginationResponse>;

  getLessonById(id: string): Promise<ApiResponse>;

  createLesson(request: CreateLessonRequest): Promise<ApiResponse>;

  updateLesson(request: UpdateLessonRequest): Promise<ApiResponse>;
}
