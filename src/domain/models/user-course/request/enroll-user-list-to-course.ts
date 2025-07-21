export class EnrollUserListToCourseRequest {
  userIDs!: string[];
  courseID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status!: string;
  enrollmentCriteriaID?: string;
  userID?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;
  enrollStatus?: string;

  constructor(init?: Partial<EnrollUserListToCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): EnrollUserListToCourseRequest {
    return new EnrollUserListToCourseRequest(data);
  }

  toJSON(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();
    Object.entries(this).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => formData.append(key, v));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }
}
