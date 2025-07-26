import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';

export interface FileResourceRepository {
  getFileResourceList: (request: GetFileResourcesRequest) => Promise<ApiPaginationResponse>;

  getFileResouceById: (id: string) => Promise<ApiResponse>;
}
