import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ChangePasswordRequest } from '@/domain/models/user/request/change-password-request';
import { type GetUserRequest } from '@/domain/models/user/request/get-user-request';
import { type CreateUsersFromExcelRequest } from '@/domain/models/user/request/import-user-request';
import { type RegisterRequestModel } from '@/domain/models/user/request/register-request';
import { type UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';

export interface UserRepository {
  getUserListInfo: (request: GetUserRequest) => Promise<ApiPaginationResponse>;

  getUserDetailInfo: (id: string) => Promise<ApiResponse>;

  updateUserInfo: (id: string, request: UpdateUserInfoRequest) => Promise<ApiResponse>;

  registerUser: (request: RegisterRequestModel) => Promise<ApiResponse>;

  changePassword: (request: ChangePasswordRequest) => Promise<ApiResponse>;

  importUsers: (request: CreateUsersFromExcelRequest) => Promise<ApiResponse>;
}
