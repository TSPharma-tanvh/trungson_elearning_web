import { ApiResponse } from '@/domain/models/core/api-response';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { UserListResult } from '@/domain/models/user/response/user-list-result';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { UserRepository } from '@/domain/repositories/user/user-repository';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';

export class UserUsecase {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserInfo(): Promise<UserResponse> {
    var userId = StoreLocalManager.getLocalData(AppStrings.USER_ID);

    if (userId === null || userId === undefined || userId.trim() === '') {
      throw new Error('User ID is missing.');
    }

    var result = await this.userRepo.getUserDetailInfo(userId);

    var userResponse = UserResponse.fromJSON(result.result);

    return userResponse;
  }

  async updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse> {
    // var userId = StoreLocalManager.getLocalData(AppStrings.USER_ID);

    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('User ID is missing.');
    }

    var result = await this.userRepo.updateUserInfo(id, request);

    return result;
  }

  async getUserListInfo(request: GetUserRequest): Promise<UserListResult> {
    const result = await this.userRepo.getUserListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(UserResponse.fromJSON);

    return {
      users: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }
}
