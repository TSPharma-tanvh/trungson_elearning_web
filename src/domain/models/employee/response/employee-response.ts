export class EmployeeResponse {
  id?: string;
  code?: string;
  name?: string;
  birthDay?: string;
  gender?: boolean;
  positionCode?: string;
  positionName?: string;
  positionStateCode?: string;
  positionStateName?: string;

  departmentTypeCode?: string;
  departmentTypeName?: string;
  departmentCode?: string;
  departmentName?: string;

  asmCode?: string;
  asmName?: string;

  statusValue?: number;
  status?: string;
  userId?: string;

  constructor(init?: Partial<EmployeeResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EmployeeResponse {
    return new EmployeeResponse({
      id: json.id,
      code: json.code,
      name: json.name,
      birthDay: json.birthDay,
      gender: json.gender,
      positionCode: json.positionCode,
      positionName: json.positionName,
      positionStateCode: json.positionStateCode,
      positionStateName: json.positionStateName,
      departmentTypeCode: json.departmentTypeCode,
      departmentTypeName: json.departmentTypeName,
      departmentCode: json.departmentCode,
      departmentName: json.departmentName,
      asmCode: json.asmCode,
      asmName: json.asmName,
      statusValue: json.statusValue,
      status: json.status,
      userId: json.userId,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      code: this.code,
      name: this.name,
      birthDay: this.birthDay,
      gender: this.gender,
      positionCode: this.positionCode,
      positionName: this.positionName,
      positionStateCode: this.positionStateCode,
      positionStateName: this.positionStateName,
      departmentTypeCode: this.departmentTypeCode,
      departmentTypeName: this.departmentTypeName,
      departmentCode: this.departmentCode,
      departmentName: this.departmentName,
      asmCode: this.asmCode,
      asmName: this.asmName,
      statusValue: this.statusValue,
      status: this.status,
      userId: this.userId,
    };
  }
}
