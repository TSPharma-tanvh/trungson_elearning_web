export class UserImportResponse {
  username = '';
  role = '';
  employeeId?: string;
  createdUserId = '';

  constructor(init?: Partial<UserImportResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserImportResponse {
    return new UserImportResponse({
      username: json?.username ?? '',
      role: json?.role ?? '',
      employeeId: json?.employeeId,
      createdUserId: json?.createdUserId ?? '',
    });
  }

  toJson(): any {
    return {
      username: this.username,
      role: this.role,
      employeeId: this.employeeId,
      createdUserId: this.createdUserId,
    };
  }
}
