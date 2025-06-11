import { LoginRequest } from '@/domain/models/auth/request/login-request';
import { ApiResponse } from '@/domain/models/core/api-response';

export interface AuthRepository {
  login(request: LoginRequest): Promise<ApiResponse>;
}
