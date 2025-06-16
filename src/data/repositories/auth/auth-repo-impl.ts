import { LoginRequest } from '@/domain/models/auth/request/login-request';
import { LoginResponse } from '@/domain/models/auth/response/login-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { AuthRepository } from '@/domain/repositories/auth/auth-repository';
import axios from 'axios';

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

    if (!apiResponse || !apiResponse.isSuccessStatusCode) {
      throw new Error(apiResponse?.message);
    }

    return apiResponse;
  }
}
