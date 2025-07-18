export class SyncEmployeeFromHrmRequest {
  username!: string;
  password!: string;

  constructor(init?: Partial<SyncEmployeeFromHrmRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): SyncEmployeeFromHrmRequest {
    return new SyncEmployeeFromHrmRequest(json);
  }

  toJson(): any {
    return { ...this };
  }
}
