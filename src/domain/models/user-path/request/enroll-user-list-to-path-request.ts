export class EnrollUserListToPathRequest {
  userIDs: string[] = [];
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status: string = '';
  enrollmentCriteriaID?: string;
  userID?: string;
  enrollStatus?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;

  constructor(init?: Partial<EnrollUserListToPathRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): EnrollUserListToPathRequest {
    return new EnrollUserListToPathRequest(data);
  }

  toJSON(): any {
    return { ...this };
  }
}
