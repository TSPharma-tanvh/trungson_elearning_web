export class GetEmployeeFromHrmRequest {
  username?: string;
  password?: string;
  page = 1;
  pageSize = 100;
  staticDate?: Date;
  employeeReturn?: number;
  status = 'on';

  constructor(init?: Partial<GetEmployeeFromHrmRequest>) {
    Object.assign(this, init);
    if (init?.staticDate) {
      this.staticDate = new Date(init.staticDate);
    }
  }

  static fromJson(json: any): GetEmployeeFromHrmRequest {
    return new GetEmployeeFromHrmRequest({
      ...json,
      staticDate: json.staticDate ? new Date(json.staticDate) : undefined,
    });
  }

  toJson(): any {
    return {
      ...this,
      staticDate: this.staticDate?.toISOString(),
    };
  }
}
