import { type GetAppSettingsResponse } from './get-app-settings-response';

export interface GetAppSettingResult {
  settings: GetAppSettingsResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
