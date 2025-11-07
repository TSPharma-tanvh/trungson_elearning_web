export class AppSettingKeyDetailResponse {
  name: string = '';
  key: string = '';

  constructor(init?: Partial<AppSettingKeyDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AppSettingKeyDetailResponse {
    return new AppSettingKeyDetailResponse({
      name: json.name,
      key: json.key,
    });
  }

  toJson(): any {
    return {
      name: this.name,
      key: this.key,
    };
  }
}
