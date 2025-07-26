import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateCoursePathRequest } from '@/domain/models/path/request/create-path-request';
import { type GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { type CoursePathResult } from '@/domain/models/path/response/course-path-result';
import { type PathRepository } from '@/domain/repositories/path/path-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class PathUsecase {
  constructor(private readonly pathRepo: PathRepository) {}

  async getPathListInfo(request: GetPathRequest): Promise<CoursePathResult> {
    const result = await this.pathRepo.getPathListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load path list.');
    }

    const data = result.result.map(CoursePathResponse.fromJson);

    return {
      path: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getPathDetailInfo(id: string): Promise<CoursePathResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.pathRepo.getPathDetailInfo(id);

    const userResponse = CoursePathResponse.fromJson(result.result);

    return userResponse;
  }

  async createPath(request: CreateCoursePathRequest): Promise<ApiResponse> {
    const response = await this.pathRepo.createPath(request);

    return response;
  }

  async updatePathInfo(request: UpdateCoursePathRequest): Promise<ApiResponse> {
    const result = await this.pathRepo.updatePath(request);

    return result;
  }

  async deletePath(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateCoursePathRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });
    const result = await this.pathRepo.updatePath(newFormData);

    return result;
  }
}
