export class EmployeeResponse {
  id?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  level?: string;
  levelId?: string;
  code?: string;
  name?: string;
  gender?: string;
  photoPath?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  currentPositionName?: string;
  currentPositionStateName?: string;
  currentDepartmentName?: string;
  currentDepartmentTypeName?: string;
  currentEmployeeTypeName?: string;
  asm?: string;
  cityName?: string;
  districtName?: string;
  wardName?: string;
  phoneNumber?: string;
  mail?: string;
  bank?: string;
  bankNumber?: string;
  isDraft?: boolean;
  isQuit?: boolean;
  isPregnant?: boolean;
  isSuspend?: boolean;
  status?: string;
  avatar?: string;
  birthDay?: string;
  createdAt?: string;
  employeeReturn?: number;
  teamName?: string;
  teamCode?: string;
  userId?: string;
  titleOfCourtesy?: string;
  birthDate?: string;
  hireDate?: string;
  homePhone?: string;
  extension?: string;
  photo?: string;
  notes?: string;
  reportsTo?: number;

  constructor(init?: Partial<EmployeeResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): EmployeeResponse {
    const dto = new EmployeeResponse();
    Object.assign(dto, json);
    return dto;
  }

  toJSON(): any {
    return { ...this };
  }
}
