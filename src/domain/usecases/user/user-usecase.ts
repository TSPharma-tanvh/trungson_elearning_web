import { ApiResponse } from '@/domain/models/core/api-response';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';
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

  async updateUserInfo(request: UpdateUserInfoRequest): Promise<ApiResponse> {
    var userId = StoreLocalManager.getLocalData(AppStrings.USER_ID);

    if (userId === null || userId === undefined || userId.trim() === '') {
      throw new Error('User ID is missing.');
    }

    var result = await this.userRepo.updateUserInfo(userId, request);

    // var userResponse = UserResponse.fromJSON(result.result);

    return result;
  }
}
