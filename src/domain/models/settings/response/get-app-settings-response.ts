export class GetAppSettingsResponse {
  id?: string;
  key = '';
  value?: string;
  description?: string;
  category?: string;
  dataType?: string;
  isDefault?: boolean;
  scope?: string;
  metadataJson?: string;

  constructor(init?: Partial<GetAppSettingsResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetAppSettingsResponse {
    return new GetAppSettingsResponse({
      id: json.id,
      key: json.key,
      value: json.value,
      description: json.description,
      category: json.category,
      dataType: json.dataType,
      isDefault: json.isDefault,
      scope: json.scope,
      metadataJson: json.metadataJson,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      key: this.key,
      value: this.value,
      description: this.description,
      category: this.category,
      dataType: this.dataType,
      isDefault: this.isDefault,
      scope: this.scope,
      metadataJson: this.metadataJson,
    };
  }
}
