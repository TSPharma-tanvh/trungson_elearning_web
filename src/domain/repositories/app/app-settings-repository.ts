import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { type GetAppSettingsRequest } from '@/domain/models/settings/request/get-app-settings-request';
import { type UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';

export interface AppSettingsRepository {
  getAppSettingListInfo: (request: GetAppSettingsRequest) => Promise<ApiPaginationResponse>;

  getAppSettingById: (id: string) => Promise<ApiResponse>;

  getAllKey: () => Promise<ApiResponse>;

  createAppSetting: (request: CreateAppSettingsRequest) => Promise<ApiResponse>;

  updateAppSetting: (request: UpdateAppSettingsRequest) => Promise<ApiResponse>;

  deleteAppSetting: (id: string) => Promise<ApiResponse>;

  syncEmployeeOrder: () => Promise<ApiResponse>;
}
