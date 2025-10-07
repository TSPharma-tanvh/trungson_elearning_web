export class UpdateUserCourseProgressRequest {
  id!: string;
  userID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  lastAccess?: string;
  status!: string;
  enrollmentCriteriaID?: string;
  enrollStatus?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;

  constructor(init?: Partial<UpdateUserCourseProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(data: any): UpdateUserCourseProgressRequest {
    return new UpdateUserCourseProgressRequest(data);
  }

  toJson(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();
    Object.entries(this).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }
}
