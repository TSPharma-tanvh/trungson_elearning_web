import { type LoginRequest } from '@/domain/models/auth/request/login-request';
import { type ApiResponse } from '@/domain/models/core/api-response';

export interface AuthRepository {
  login: (request: LoginRequest) => Promise<ApiResponse>;
  logout: () => Promise<ApiResponse>;
}
