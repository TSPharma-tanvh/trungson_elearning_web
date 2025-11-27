import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateFileResourcesRequest } from '@/domain/models/file/request/create-file-resource-request';
import { type GetFileResourcesRequest } from '@/domain/models/file/request/get-file-resource-request';
import { type UpdateFileResourcesRequest } from '@/domain/models/file/request/update-file-resource-request';
import { type FileResourceListForAdminResult } from '@/domain/models/file/response/file-resource-for-admin-result';
import { FileResourcesResponseForAdmin } from '@/domain/models/file/response/file-resources-for-admin-response';
import { type FileResourceRepository } from '@/domain/repositories/file/file-resources-repository';

export class FileResourcesUsecase {
  constructor(private readonly fileRepo: FileResourceRepository) {}

  async getFileResourceList(request: GetFileResourcesRequest): Promise<FileResourceListForAdminResult> {
    const result = await this.fileRepo.getFileResourceList(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => FileResourcesResponseForAdmin.fromJson(x));

    return {
      files: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getFileResourceById(id: string): Promise<FileResourcesResponseForAdmin> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.fileRepo.getFileResourceById(id);

    const userResponse = FileResourcesResponseForAdmin.fromJson(result.result);

    return userResponse;
  }

  async createResource(request: CreateFileResourcesRequest): Promise<ApiResponse> {
    return await this.fileRepo.createResource(request);
  }

  async updateResource(update: UpdateFileResourcesRequest): Promise<ApiResponse> {
    return await this.fileRepo.updateResource(update);
  }

  async deleteResource(id: string): Promise<ApiResponse> {
    return await this.fileRepo.deleteResource(id);
  }
}
