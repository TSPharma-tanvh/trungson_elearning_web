import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateLessonRequest } from '@/domain/models/lessons/request/create-lesson-request';
import { ExportLessonProgressReportRequest } from '@/domain/models/lessons/request/export-lesson-progress-report-request';
import { type GetLessonRequest } from '@/domain/models/lessons/request/get-lesson-request';
import { type UpdateLessonRequest } from '@/domain/models/lessons/request/update-lesson-request';

export interface LessonRepository {
  getLessonListInfo: (request: GetLessonRequest) => Promise<ApiPaginationResponse>;

  getLessonById: (id: string) => Promise<ApiResponse>;

  createLesson: (request: CreateLessonRequest) => Promise<ApiResponse>;

  updateLesson: (request: UpdateLessonRequest) => Promise<ApiResponse>;

  deleteLessonPermanent: (id: string) => Promise<ApiResponse>;

  exportLesson: (request: ExportLessonProgressReportRequest) => Promise<ApiResponse>;
}
