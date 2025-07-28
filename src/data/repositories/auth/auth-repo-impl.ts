import { type LoginRequest } from '@/domain/models/auth/request/login-request';
import { type LoginResponse } from '@/domain/models/auth/response/login-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type AuthRepository } from '@/domain/repositories/auth/auth-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class AuthRepositoryImpl implements AuthRepository {
  async login(request: LoginRequest): Promise<ApiResponse> {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(apiEndpoints.identity.signIn, {
      userName: request.userName,
      password: request.password,
      rememberMe: true,
      returnUrl: '',
      requestVerificationToken: '',
    });

    const apiResponse = response.data;

    if (!apiResponse?.isSuccessStatusCode) {
      throw new Error(apiResponse?.message);
    }

    return apiResponse;
  }
}
