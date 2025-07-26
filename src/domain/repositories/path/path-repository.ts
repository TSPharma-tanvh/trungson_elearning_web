import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateCoursePathRequest } from '@/domain/models/path/request/create-path-request';
import { type GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { type UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';

export interface PathRepository {
  getPathListInfo: (request: GetPathRequest) => Promise<ApiPaginationResponse>;

  getPathDetailInfo: (id: string) => Promise<ApiResponse>;

  updatePath: (request: UpdateCoursePathRequest) => Promise<ApiResponse>;

  createPath: (request: CreateCoursePathRequest) => Promise<ApiResponse>;
}
