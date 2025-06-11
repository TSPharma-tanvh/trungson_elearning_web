import { ApiResponse } from '@/domain/models/core/api-response';
import { UpdateUserInfoRequest } from '@/domain/models/user/request/user-update-request';

export interface UserRepository {
  getUserListInfo(id: string): Promise<ApiResponse>;

  getUserDetailInfo(id: string): Promise<ApiResponse>;

  updateUserInfo(id: string, request: UpdateUserInfoRequest): Promise<ApiResponse>;
}
