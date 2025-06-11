import { resourceLimits } from 'worker_threads';

import { LoginRequest } from '@/domain/models/auth/request/login-request';
import { LoginResponse } from '@/domain/models/auth/response/login-response';
import { AuthRepository } from '@/domain/repositories/auth/auth-repository';
import AppStrings from '@/utils/app-strings';
import StoreLocalManager from '@/utils/store-manager';

export class SignInUseCase {
  constructor(private readonly authRepo: AuthRepository) {}

  /**
   * Sign in with username and password.
   * Performs domain-level validation and delegates to repository.
   */
  async execute(request: LoginRequest): Promise<LoginResponse> {
    if (!request.userName || !request.password) {
      throw new Error('Username and password are required.');
    }
    var result = await this.authRepo.login(request);

    var loginResponse = LoginResponse.fromJSON(result.result);

    StoreLocalManager.saveIfValid(AppStrings.ACCESS_TOKEN, loginResponse.token);
    StoreLocalManager.saveIfValid(AppStrings.REFRESH_TOKEN, loginResponse.refreshToken);
    StoreLocalManager.saveIfValid(AppStrings.USER_ID, loginResponse.userId);

    // // Save entire user object if essential fields are valid
    // if (StoreLocalManager.isValid(result.token) && StoreLocalManager.isValid(result.userId)) {
    //   StoreLocalManager.saveLocalData(AppStrings.USER_DATA, result.toJSON());
    // }

    return loginResponse;
  }
}
