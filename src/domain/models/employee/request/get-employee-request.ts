import { DateTimeUtils } from '@/utils/date-time-utils';

export class GetEmployeeRequest {
  pageNumber = 1;
  pageSize = 10;
  level?: string;
  hireDate?: Date;
  code?: string;
  name?: string;
  gender?: string;
  asm?: string;
  cityName?: string;
  districtName?: string;
  wardName?: string;
  bank?: string;
  bankNumber?: string;
  searchText?: string;

  constructor(init?: Partial<GetEmployeeRequest>) {
    Object.assign(this, init);
    if (init?.hireDate) {
      this.hireDate = new Date(init.hireDate);
    }
  }

  static fromJson(json: any): GetEmployeeRequest {
    return new GetEmployeeRequest({
      ...json,
      hireDate: json.hireDate ? new Date(json.hireDate) : undefined,
    });
  }

  toJson(): any {
    return {
      ...this,
      hireDate: this.hireDate ? DateTimeUtils.formatISODateToString(this.hireDate)?.toString() : undefined,
    };
  }
}
