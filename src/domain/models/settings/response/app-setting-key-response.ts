import { AppSettingKeyDetailResponse } from './app-setting-key-detail-response';

export class AppSettingKeyResponse {
  category: string = '';
  data: AppSettingKeyDetailResponse[] = [];

  constructor(init?: Partial<AppSettingKeyResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AppSettingKeyResponse {
    return new AppSettingKeyResponse({
      category: json.category,
      data: Array.isArray(json.data) ? json.data.map((x: any) => AppSettingKeyDetailResponse.fromJson(x)) : [],
    });
  }

  toJson(): any {
    return {
      category: this.category,
      data: this.data.map((x) => x.toJson()),
    };
  }
}
