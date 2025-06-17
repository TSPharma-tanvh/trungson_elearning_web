import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';

export interface UserRepository {
  getUserListInfo(request: GetUserRequest): Promise<ApiPaginationResponse>;

  getUserDetailInfo(id: string): Promise<ApiResponse>;

  updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse>;

  registerUser(request: RegisterRequestModel): Promise<ApiResponse>;

  changePassword(request: ChangePasswordRequest): Promise<ApiResponse>;
}
