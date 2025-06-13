export class GetRoleRequest {
  id?: string;
  name?: string;
  isActive?: boolean;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetRoleRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetRoleRequest {
    return new GetRoleRequest({
      id: json?.id,
      name: json?.name,
      isActive: json?.isActive,
      pageNumber: json?.pageNumber ?? 1,
      pageSize: json?.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      name: this.name,
      isActive: this.isActive,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
