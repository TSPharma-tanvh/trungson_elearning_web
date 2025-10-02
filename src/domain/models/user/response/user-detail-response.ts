import { EmployeeResponse } from '../../employee/response/employee-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class UserDetailResponse {
  id!: string;
  userName?: string;
  email?: string;
  firstName = '';
  lastName = '';
  phoneNumber?: string;
  isActive?: boolean;
  employeeId?: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  roles?: string[];
  rolePermissions: Record<string, string[]> = {};
  employee?: EmployeeResponse;

  constructor(init?: Partial<UserDetailResponse>) {
    Object.assign(this, init);
  }
  static fromJson(data: any): UserDetailResponse {
    return new UserDetailResponse({
      ...data,
      thumbnail: data.thumbnail ? FileResourcesResponse.fromJson(data.thumbnail) : undefined,
      employee: data.employee ? EmployeeResponse.fromJson(data.employee) : undefined,
    });
  }

  toJson(): any {
    return {
      ...this,
      thumbnail: this.thumbnail?.toJson(),
      employee: this.employee?.toJson(),
    };
  }
}
