import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { type GetAppSettingsRequest } from '@/domain/models/settings/request/get-app-settings-request';
import { type UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';
import { type AppSettingsRepository } from '@/domain/repositories/app/app-settings-repository';

import { customApiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class AppSettingsRepoImpl implements AppSettingsRepository {
  async getAppSettingListInfo(request: GetAppSettingsRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await customApiClient.get<ApiPaginationResponse>(apiEndpoints.appSettings.getAll, {
        params: request.toJson(),
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch app settings list');
    }
  }

  async getAppSettingById(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.appSettings.getById(id));

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch app setting by id');
    }
  }

  async getAllKey(): Promise<ApiResponse> {
    try {
      const response = await customApiClient.get<ApiResponse>(apiEndpoints.appSettings.getAllKey);

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch app setting keys');
    }
  }

  async createAppSetting(request: CreateAppSettingsRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.post<ApiResponse>(apiEndpoints.appSettings.create, request.toJson(), {
        timeout: 3600000,
      });

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to create app setting');
    }
  }

  async updateAppSetting(request: UpdateAppSettingsRequest): Promise<ApiResponse> {
    try {
      const response = await customApiClient.put<ApiResponse>(apiEndpoints.appSettings.update, request.toJson());

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to update app setting');
    }
  }

  async deleteAppSetting(id: string): Promise<ApiResponse> {
    try {
      const response = await customApiClient.delete<ApiResponse>(apiEndpoints.appSettings.delete(id));

      const apiResponse = response.data;

      if (!apiResponse?.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to delete app setting');
    }
  }
}
