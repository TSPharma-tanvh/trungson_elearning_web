import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { type GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { CreateUsersFromExcelRequest } from '@/domain/models/user/request/import-user-request';
import { type RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { type UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
import { ImportUsersResponse } from '@/domain/models/user/response/import-users-response';
import { type UserListResult } from '@/domain/models/user/response/user-list-result';
import { UserResponse } from '@/domain/models/user/response/user-response';
import { type UserRepository } from '@/domain/repositories/user/user-repository';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';

export class UserUsecase {
  constructor(private readonly userRepo: UserRepository) {}

  async getUserInfo(): Promise<UserResponse> {
    const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID);

    if (userId === null || userId === undefined || userId.trim() === '') {
      throw new Error('User ID is missing.');
    }

    const result = await this.userRepo.getUserDetailInfo(userId);

    const userResponse = UserResponse.fromJSON(result.result);

    return userResponse;
  }

  async getUserInfoWithId(id: string): Promise<UserResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('User ID is missing.');
    }

    const result = await this.userRepo.getUserDetailInfo(id);

    const userResponse = UserResponse.fromJSON(result.result);

    return userResponse;
  }

  async updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('User ID is missing.');
    }

    const result = await this.userRepo.updateUserInfo(id, request);

    return result;
  }

  async getUserListInfo(request: GetUserRequest): Promise<UserListResult> {
    const result = await this.userRepo.getUserListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(UserResponse.fromJSON);
    const data = result.result.map((x) => UserResponse.fromJSON(x));

    return {
      users: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async changePassword(request: ChangePasswordRequest): Promise<ApiResponse> {
    const userId = StoreLocalManager.getLocalData(AppStrings.USER_ID);

    if (userId === null || userId === undefined || userId.trim() === '') {
      throw new Error('User ID is missing.');
    }

    console.log('changing password');
    const response = await this.userRepo.changePassword(request);

    return response;
  }

  async registerUser(request: RegisterRequestModel): Promise<ApiResponse> {
    const result = await this.userRepo.registerUser(request);

    return result;
  }

  async importUsers(request: CreateUsersFromExcelRequest): Promise<ImportUsersResponse> {
    const apiResponse = await this.userRepo.importUsers(request);

    if (!apiResponse?.isSuccessStatusCode) {
      throw new Error(apiResponse?.message || 'Failed to import users');
    }

    return ImportUsersResponse.fromJSON(apiResponse.result);
  }
}
