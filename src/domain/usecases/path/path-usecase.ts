import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetPathRequest } from '@/domain/models/path/request/get-path-request';
import { UpdateCoursePathRequest } from '@/domain/models/path/request/update-path-request';
import { CoursePathResponse } from '@/domain/models/path/response/course-path-response';
import { CoursePathResult } from '@/domain/models/path/response/course-path-result';
import { PathRepository } from '@/domain/repositories/path/path-repository';

export class PathUsecase {
  constructor(private readonly pathRepo: PathRepository) {}

  async getPathListInfo(request: GetPathRequest): Promise<CoursePathResult> {
    var result = await this.pathRepo.getPathListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
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
      throw new Error('User ID is missing.');
    }

    var result = await this.pathRepo.getPathDetailInfo(id);

    var userResponse = CoursePathResponse.fromJson(result.result);

    return userResponse;
  }

  async updatePathInfo(request: UpdateCoursePathRequest): Promise<ApiResponse> {
    var result = await this.pathRepo.updatePath(request);

    return result;
  }
}
