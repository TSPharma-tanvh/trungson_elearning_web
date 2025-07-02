import { CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';

export interface ClassRepository {
  getClassListInfo(request: GetClassRequest): Promise<ApiPaginationResponse>;

  getClassById(id: string): Promise<ApiResponse>;

  createClass(request: CreateClassRequest): Promise<ApiResponse>;

  updateClass(request: UpdateClassRequest): Promise<ApiResponse>;
}
