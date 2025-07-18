export class CreateUserPathProgressRequest {
  userID!: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status!: string; //UserProgressEnum
  enrollmentCriteriaID?: string;
  enrollStatus?: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectedReason?: string;

  constructor(init?: Partial<CreateUserPathProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): CreateUserPathProgressRequest {
    return new CreateUserPathProgressRequest(data);
  }

  toJSON(): any {
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
