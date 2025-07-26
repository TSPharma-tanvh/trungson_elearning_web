import { type FileResourceListResult } from '@/domain/models/file/response/file-resource-result';
import { FileResourcesResponse } from '@/domain/models/file/response/file-resources-response';
import { type GetFileResourcesRequest } from '@/domain/models/file/resquest/get-file-resource-request';
import { type FileResourceRepository } from '@/domain/repositories/file/file-resources-repository';

export class FileResourcesUsecase {
  constructor(private readonly fileRepo: FileResourceRepository) {}

  async getFileResourceList(request: GetFileResourcesRequest): Promise<FileResourceListResult> {
    const result = await this.fileRepo.getFileResourceList(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(FileResourcesResponse.fromJson);

    return {
      files: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getFileResouceById(id: string): Promise<FileResourcesResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.fileRepo.getFileResouceById(id);

    const userResponse = FileResourcesResponse.fromJson(result.result);

    return userResponse;
  }
}
