import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { UpdateClassTeacherRequest } from '@/domain/models/teacher/request/udpate-class-teacher-request';

export interface ClassTeacherRepository {
  getClassTeacherListInfo(request: GetClassTeacherRequest): Promise<ApiPaginationResponse>;

  getClassTeacherById(id: string): Promise<ApiResponse>;

  createClassTeacher(request: CreateClassTeacherRequest): Promise<ApiResponse>;

  updateClassTeacher(request: UpdateClassTeacherRequest): Promise<ApiResponse>;
}
