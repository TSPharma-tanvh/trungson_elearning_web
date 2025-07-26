import { type CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { type GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { type UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';

export interface ClassRepository {
  getClassListInfo: (request: GetClassRequest) => Promise<ApiPaginationResponse>;

  getClassById: (id: string) => Promise<ApiResponse>;

  createClass: (request: CreateClassRequest) => Promise<ApiResponse>;

  updateClass: (request: UpdateClassRequest) => Promise<ApiResponse>;
}
