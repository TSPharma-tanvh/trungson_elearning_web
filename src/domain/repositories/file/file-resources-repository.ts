import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateFileResourcesRequest } from '@/domain/models/file/resquest/create-file-resource-request';
import { type GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { type UpdateFileResourcesRequest } from '@/domain/models/file/resquest/update-file-resource-request';

export interface FileResourceRepository {
  getFileResourceList: (request: GetFileResourcesRequest) => Promise<ApiPaginationResponse>;

  getFileResourceById: (id: string) => Promise<ApiResponse>;

  createResource: (
    request: CreateFileResourcesRequest,
    options?: { suppressSuccessMessage?: boolean }
  ) => Promise<ApiResponse>;

  updateResource: (
    request: UpdateFileResourcesRequest,
    options?: { suppressSuccessMessage?: boolean }
  ) => Promise<ApiResponse>;

  deleteResource: (id: string) => Promise<ApiResponse>;
}
