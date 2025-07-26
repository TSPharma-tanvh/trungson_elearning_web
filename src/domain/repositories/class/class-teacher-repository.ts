import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { type GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { type UpdateClassTeacherRequest } from '@/domain/models/teacher/request/update-class-teacher-request';

export interface ClassTeacherRepository {
  getClassTeacherListInfo: (request: GetClassTeacherRequest) => Promise<ApiPaginationResponse>;

  getClassTeacherById: (id: string) => Promise<ApiResponse>;

  createClassTeacher: (request: CreateClassTeacherRequest) => Promise<ApiResponse>;

  updateClassTeacher: (request: UpdateClassTeacherRequest) => Promise<ApiResponse>;
}
