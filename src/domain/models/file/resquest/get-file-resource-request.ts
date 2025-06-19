import { StatusEnum } from '@/utils/enum/core-enum';

export class GetFileResourcesRequest {
  type?: string;
  status?: StatusEnum;
  searchText?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetFileResourcesRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetFileResourcesRequest {
    return new GetFileResourcesRequest({
      type: json.type,
      status: json.status,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      type: this.type,
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
