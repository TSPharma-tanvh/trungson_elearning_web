export class GetUserRequest {
  userId?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
  firstChangePassword?: boolean;
  roles?: string[] = [];
  searchTerm?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetUserRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserRequest {
    return new GetUserRequest({
      userId: json?.userId,
      userName: json?.userName,
      email: json?.email,
      firstName: json?.firstName,
      lastName: json?.lastName,
      phoneNumber: json?.phoneNumber,
      isActive: json?.isActive ?? true,
      firstChangePassword: json?.firstChangePassword ?? false,
      roles: Array.isArray(json?.roles) ? json.roles : [],
      searchTerm: json?.searchTerm,
      pageNumber: json?.pageNumber ?? 1,
      pageSize: json?.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      userId: this.userId,
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber,
      isActive: this.isActive,
      firstChangePassword: this.firstChangePassword,
      roles: this.roles,
      searchTerm: this.searchTerm,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    if (this.userId) form.append('userId', this.userId);
    if (this.userName) form.append('userName', this.userName);
    if (this.email) form.append('email', this.email);
    if (this.firstName) form.append('firstName', this.firstName);
    if (this.lastName) form.append('lastName', this.lastName);
    if (this.phoneNumber) form.append('phoneNumber', this.phoneNumber);

    if (this.isActive !== undefined) form.append('isActive', String(this.isActive));
    if (this.firstChangePassword !== undefined) form.append('firstChangePassword', String(this.firstChangePassword));

    if (this.roles?.length)
      this.roles.forEach((role) => {
        form.append('roles', role);
      });

    if (this.searchTerm) form.append('searchTerm', this.searchTerm);

    form.append('pageNumber', String(this.pageNumber));
    form.append('pageSize', String(this.pageSize));

    return form;
  }
}
