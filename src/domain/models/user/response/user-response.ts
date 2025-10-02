import { EmployeeResponse } from '../../employee/response/employee-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class UserResponse {
  id!: string;
  userName?: string;
  email?: string;
  firstName!: string;
  lastName!: string;
  phoneNumber!: string;
  isActive!: boolean;
  employeeId!: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  roles?: string[];
  rolePermissions: Record<string, string[]> = {};
  employee?: EmployeeResponse;

  static fromJson(json: any): UserResponse {
    const dto = new UserResponse();
    dto.id = json.id;
    dto.userName = json.userName;
    dto.email = json.email;
    dto.firstName = json.firstName;
    dto.lastName = json.lastName;
    dto.phoneNumber = json.phoneNumber;
    dto.isActive = json.isActive;
    dto.employeeId = json.employeeId;
    dto.thumbnailId = json.thumbnailId;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.roles = json.roles ?? [];
    dto.rolePermissions = json.rolePermissions ?? {};
    dto.employee = json.employee ? EmployeeResponse.fromJson(json.employee) : undefined;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      isActive: this.isActive,
      employeeId: this.employeeId,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      roles: this.roles,
      rolePermissions: this.rolePermissions,
      employee: this.employee?.toJson(),
    };
  }
}
