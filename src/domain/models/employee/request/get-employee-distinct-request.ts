export class GetEmployeeDistinctRequest {
  type?: string;

  constructor(init?: Partial<GetEmployeeDistinctRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetEmployeeDistinctRequest {
    return new GetEmployeeDistinctRequest({
      ...json,
    });
  }

  toJson(): any {
    return {
      ...this,
    };
  }
}
