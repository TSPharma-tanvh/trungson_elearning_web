import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserPathProgressRequest } from '@/domain/models/user-path/request/create-user-path-progress-request';
import { type EnrollUserListToPathRequest } from '@/domain/models/user-path/request/enroll-user-list-to-path-request';
import { type GetUserPathProgressRequest } from '@/domain/models/user-path/request/get-user-path-progress-request';
import { type UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';
import { UserPathProgressDetailResponse } from '@/domain/models/user-path/response/user-path-progress-detail-response';
import { type UserPathProgressDetailListResult } from '@/domain/models/user-path/response/user-path-progress-detail-result';
import { type UserPathProgressRepository } from '@/domain/repositories/progress/user-path-progress-repository';

export class UserPathProgressUsecase {
  constructor(private readonly userPathProgressRepo: UserPathProgressRepository) {}

  async getUserPathProgressListInfo(request: GetUserPathProgressRequest): Promise<UserPathProgressDetailListResult> {
    const result = await this.userPathProgressRepo.getUserPathProgressListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(UserPathProgressDetailResponse.fromJson);
    const data = result.result.map((x) => UserPathProgressDetailResponse.fromJson(x));

    return {
      progress: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getUserPathProgressById(id: string): Promise<UserPathProgressDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.userPathProgressRepo.getUserPathProgressById(id);

    const userResponse = UserPathProgressDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createUserPathProgress(request: CreateUserPathProgressRequest): Promise<ApiResponse> {
    const response = await this.userPathProgressRepo.createUserPathProgress(request);

    return response;
  }

  async updateUserPathProgress(request: UpdateUserPathProgressRequest): Promise<ApiResponse> {
    const result = await this.userPathProgressRepo.updateUserPathProgress(request);

    return result;
  }

  async enrollUserPathProgress(request: EnrollUserListToPathRequest): Promise<ApiResponse> {
    const response = await this.userPathProgressRepo.enrollUserListToPath(request);

    return response;
  }

  async deleteUserPathProgress(id: string): Promise<ApiResponse> {
    const result = await this.userPathProgressRepo.deleteUserPathProgress(id);

    return result;
  }
}
