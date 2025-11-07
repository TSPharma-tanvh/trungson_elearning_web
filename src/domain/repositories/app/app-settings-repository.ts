import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateAppSettingsRequest } from '@/domain/models/settings/request/create-app-setting-request';
import { GetAppSettingsRequest } from '@/domain/models/settings/request/get-app-settings-request';
import { UpdateAppSettingsRequest } from '@/domain/models/settings/request/update-app-setting-request';

export interface AppSettingsRepository {
  getAppSettingListInfo: (request: GetAppSettingsRequest) => Promise<ApiPaginationResponse>;

  getAppSettingById: (id: string) => Promise<ApiResponse>;

  getAllKey: () => Promise<ApiResponse>;

  createAppSetting: (request: CreateAppSettingsRequest) => Promise<ApiResponse>;

  updateAppSetting: (request: UpdateAppSettingsRequest) => Promise<ApiResponse>;

  deleteAppSetting: (id: string) => Promise<ApiResponse>;
}
