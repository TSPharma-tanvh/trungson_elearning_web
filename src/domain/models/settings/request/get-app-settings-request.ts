export class GetAppSettingsRequest {
  category?: string;
  dataType?: string;
  isDefault?: boolean;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetAppSettingsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetAppSettingsRequest {
    return new GetAppSettingsRequest({
      category: json.category,
      dataType: json.dataType,
      isDefault: json.isDefault,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      category: this.category,
      dataType: this.dataType,
      isDefault: this.isDefault,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
