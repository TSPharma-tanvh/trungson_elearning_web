import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserPathProgressRequest } from '@/domain/models/user-path/request/create-user-path-progress-request';
import { EnrollUserListToPathRequest } from '@/domain/models/user-path/request/enroll-user-list-to-path-request';
import { GetUserPathProgressRequest } from '@/domain/models/user-path/request/get-user-path-progress-request';
import { UpdateUserPathProgressRequest } from '@/domain/models/user-path/request/update-user-path-progress-request';

export interface UserPathProgressRepository {
  getUserPathProgressListInfo(request: GetUserPathProgressRequest): Promise<ApiPaginationResponse>;

  getUserPathProgressById(id: string): Promise<ApiResponse>;

  createUserPathProgress(request: CreateUserPathProgressRequest): Promise<ApiResponse>;

  updateUserPathProgress(request: UpdateUserPathProgressRequest): Promise<ApiResponse>;

  enrollUserListToPath(request: EnrollUserListToPathRequest): Promise<ApiResponse>;
}
