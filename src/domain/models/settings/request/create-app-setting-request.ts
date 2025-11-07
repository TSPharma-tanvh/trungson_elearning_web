export class CreateAppSettingsRequest {
  key: string = '';
  value?: string;
  description?: string;
  category: string = 'General';
  dataType: string = 'String';
  isDefault?: boolean;
  scope?: string;
  metadataJson?: string;

  constructor(init?: Partial<CreateAppSettingsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateAppSettingsRequest {
    return new CreateAppSettingsRequest({
      key: json.key,
      value: json.value,
      description: json.description,
      category: json.category ?? 'General',
      dataType: json.dataType ?? 'String',
      isDefault: json.isDefault,
      scope: json.scope,
      metadataJson: json.metadataJson,
    });
  }

  toJson(): any {
    return {
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
