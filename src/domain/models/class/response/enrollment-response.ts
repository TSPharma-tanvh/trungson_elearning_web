export class EnrollmentResponse {
  id?: string;
  userID?: number;
  targetType?: string;
  targetID?: number;
  enrollmentDate?: Date;
  status?: string;
  approvedBy?: number;
  approvedAt?: Date;
  rejectedReason?: string;
  enrollmentCriteriaID?: string;

  constructor(init?: Partial<EnrollmentResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentResponse {
    return new EnrollmentResponse({
      id: json.id,
      userID: json.userID,
      targetType: json.targetType,
      targetID: json.targetID,
      enrollmentDate: json.enrollmentDate ? new Date(json.enrollmentDate) : undefined,
      status: json.status,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      targetType: this.targetType,
      targetID: this.targetID,
      enrollmentDate: this.enrollmentDate?.toISOString(),
      status: this.status,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
    };
  }
}
