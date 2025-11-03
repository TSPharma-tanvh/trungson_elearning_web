export class SyncDepartmentFromHrmRequest {
  username!: string;
  password!: string;

  constructor(init?: Partial<SyncDepartmentFromHrmRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): SyncDepartmentFromHrmRequest {
    return new SyncDepartmentFromHrmRequest(json);
  }

  toJson(): any {
    return { ...this };
  }
}
