export class EmployeeResponse {
  id?: string;
  lastName?: string;
  firstName?: string;
  title?: string;
  titleOfCourtesy?: string;
  birthDate?: string;
  hireDate?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  homePhone?: string;
  extension?: string;
  photo?: number[]; // assuming byte[] maps to number[]
  notes?: string;
  reportsTo?: number;
  photoPath?: string;
  userId?: string;
  levelId?: string;
  code?: string;
  name?: string;
  gender?: string;
  avatar?: string;
  birthDay?: string;
  currentEmployeeTypeName?: string;
  currentDepartmentTypeName?: string;
  currentDepartmentName?: string;
  currentPositionName?: string;
  currentPositionStateName?: string;
  asm?: string;
  cityName?: string;
  districtName?: string;
  wardName?: string;
  createdAt?: string;
  bank?: string;
  bankNumber?: string;
  isDraft?: boolean;
  isQuit?: boolean;
  isPregnant?: boolean;
  isSuspend?: boolean;
  status?: string;
  mail?: string;
  employeeReturn?: number;
  teamName?: string;
  teamCode?: string;

  constructor(init?: Partial<EmployeeResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): EmployeeResponse {
    return new EmployeeResponse({
      ...json,
      photo: Array.isArray(json.photo) ? json.photo : undefined,
    });
  }

  toJSON(): any {
    return {
      ...this,
      photo: this.photo,
    };
  }
}
