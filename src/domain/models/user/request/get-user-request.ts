export class GetUserRequest {
  userId?: string;
  userName?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  roles?: string[] = [];
  searchTerm?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetUserRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetUserRequest {
    return new GetUserRequest({
      userId: json?.userId,
      userName: json?.userName,
      email: json?.email,
      firstName: json?.firstName,
      lastName: json?.lastName,
      roles: Array.isArray(json?.roles) ? json.roles : [],
      searchTerm: json?.searchTerm,
      pageNumber: json?.pageNumber ?? 1,
      pageSize: json?.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      userId: this.userId,
      userName: this.userName,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
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
    if (this.roles?.length) this.roles.forEach((role) => form.append('roles', role));
    if (this.searchTerm) form.append('searchTerm', this.searchTerm);
    form.append('pageNumber', String(this.pageNumber));
    form.append('pageSize', String(this.pageSize));
    return form;
  }
}
