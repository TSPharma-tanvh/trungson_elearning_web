import { type DisplayTypeEnum, type StatusEnum } from '@/utils/enum/path-enum';

export class GetPathRequest {
  name?: string;
  detail?: string;
  isRequired?: boolean;
  startTimeFrom?: string;
  startTimeTo?: string;
  endTimeFrom?: string;
  endTimeTo?: string;
  status?: StatusEnum;
  displayType?: DisplayTypeEnum;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetPathRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetPathRequest {
    return new GetPathRequest({
      name: json.name,
      detail: json.detail,
      isRequired: json.isRequired,
      startTimeFrom: json.startTimeFrom,
      startTimeTo: json.startTimeTo,
      endTimeFrom: json.endTimeFrom,
      endTimeTo: json.endTimeTo,
      status: json.status,
      displayType: json.displayType,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      name: this.name,
      detail: this.detail,
      isRequired: this.isRequired,
      startTimeFrom: this.startTimeFrom,
      startTimeTo: this.startTimeTo,
      endTimeFrom: this.endTimeFrom,
      endTimeTo: this.endTimeTo,
      status: this.status,
      displayType: this.displayType,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
