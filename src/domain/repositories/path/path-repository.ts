import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateCoursePathRequest } from '@/domain/models/path/request/create-path-request';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';

export interface PathRepository {
  getPathListInfo(request: GetPathRequest): Promise<ApiPaginationResponse>;

  getPathDetailInfo(id: string): Promise<ApiResponse>;

  updatePath(request: UpdateCoursePathRequest): Promise<ApiResponse>;

  createPath(request: CreateCoursePathRequest): Promise<ApiResponse>;
}
