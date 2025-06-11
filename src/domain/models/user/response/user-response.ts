import { EmployeeResponse } from '../../employee/response/employee-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class UserResponse {
  id!: string;
  userName?: string;
  email?: string;
  firstName!: string;
  lastName!: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  roles?: string[];
  rolePermissions: Record<string, string[]> = {};
  employee?: EmployeeResponse;

  static fromJSON(json: any): UserResponse {
    const dto = new UserResponse();
    dto.id = json.id;
    dto.userName = json.userName;
    dto.email = json.email;
    dto.firstName = json.firstName;
    dto.lastName = json.lastName;
    dto.thumbnailId = json.thumbnailId;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJSON(json.thumbnail) : undefined;
    dto.roles = json.roles ?? [];
    dto.rolePermissions = json.rolePermissions ?? {};
    dto.employee = json.employee ? EmployeeResponse.fromJSON(json.employee) : undefined;
    return dto;
  }

  toJSON(): any {
    return {
      id: this.id,
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJSON(),
      roles: this.roles,
      rolePermissions: this.rolePermissions,
      employee: this.employee?.toJSON(),
    };
  }
}
