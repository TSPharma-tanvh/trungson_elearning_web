export class EmployeeDistinctResponse {
  code?: string;
  name?: string;

  constructor(init?: Partial<EmployeeDistinctResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EmployeeDistinctResponse {
    return new EmployeeDistinctResponse({
      code: json.code,
      name: json.name,
    });
  }

  toJson(): any {
    return {
      code: this.code,
      name: this.name,
    };
  }
}
