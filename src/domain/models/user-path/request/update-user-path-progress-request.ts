export class UpdateUserPathProgressRequest {
  id!: string;
  userID?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status!: string; //UserProgressEnum
  enrollmentID?: string;

  constructor(init?: Partial<UpdateUserPathProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UpdateUserPathProgressRequest {
    return new UpdateUserPathProgressRequest(data);
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
