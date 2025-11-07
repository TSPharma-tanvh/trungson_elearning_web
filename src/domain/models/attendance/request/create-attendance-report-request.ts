export class CreateAttendanceReportRequest {
  classID!: string;
  enrollmentCriteriaID?: string;
  isDefaultEnroll?: boolean = true;
  startAt!: Date;

  constructor(init?: Partial<CreateAttendanceReportRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateAttendanceReportRequest {
    return new CreateAttendanceReportRequest({
      classID: json.classID,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      isDefaultEnroll: json.isDefaultEnroll ?? true,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
    });
  }

  toJson(): any {
    return {
      classID: this.classID,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      isDefaultEnroll: this.isDefaultEnroll,
      startAt: this.startAt?.toISOString(),
    };
  }
}
