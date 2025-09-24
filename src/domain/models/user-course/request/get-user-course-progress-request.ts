export class GetUserCourseProgressRequest {
  userID?: string;
  courseID?: string;
  enrollmentCriteriaId?: string;
  hasPath?: boolean;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: string; // required
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserCourseProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): GetUserCourseProgressRequest {
    return new GetUserCourseProgressRequest(data);
  }

  toJSON(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();
    Object.entries(this).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          formData.append(key, v);
        });
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    return formData;
  }
}
