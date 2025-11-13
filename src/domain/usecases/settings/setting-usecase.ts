import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { type GetAppSettingsRequest } from '@/domain/models/settings/request/get-app-settings-request';
import { type UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';
import { AppSettingKeyResponse } from '@/domain/models/settings/response/app-setting-key-response';
import { type GetAppSettingResult } from '@/domain/models/settings/response/get-app-setting-result';
import { GetAppSettingsResponse } from '@/domain/models/settings/response/get-app-settings-response';
import { type AppSettingsRepository } from '@/domain/repositories/app/app-settings-repository';

export class AppSettingsUsecase {
  constructor(private readonly appSettingRepo: AppSettingsRepository) {}

  async getAppSettingListInfo(request: GetAppSettingsRequest): Promise<GetAppSettingResult> {
    const result = await this.appSettingRepo.getAppSettingListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => GetAppSettingsResponse.fromJson(x));

    return {
      settings: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getAppSettingById(id: string): Promise<GetAppSettingsResponse> {
    const result = await this.appSettingRepo.getAppSettingById(id);

    const userResponse = GetAppSettingsResponse.fromJson(result.result);

    return userResponse;
  }

  async getAllKey(): Promise<AppSettingKeyResponse> {
    const result = await this.appSettingRepo.getAllKey();

    const userResponse = AppSettingKeyResponse.fromJson(result.result);

    return userResponse;
  }

  async createAppSetting(request: CreateAppSettingsRequest): Promise<ApiResponse> {
    const result = await this.appSettingRepo.createAppSetting(request);

    return result;
  }

  async updateAppSetting(request: UpdateAppSettingsRequest): Promise<ApiResponse> {
    const result = await this.appSettingRepo.updateAppSetting(request);

    return result;
  }

  async deleteAppSetting(id: string): Promise<ApiResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.appSettingRepo.deleteAppSetting(id);

    return result;
  }
}
