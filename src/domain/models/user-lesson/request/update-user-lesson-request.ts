export class UpdateUserLessonRequest {
  id!: string;
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: Date;
  status?: string;
  actualStartDate?: string;
  actualEndDate?: string;

  constructor(init?: Partial<UpdateUserLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(data: any): UpdateUserLessonRequest {
    return new UpdateUserLessonRequest(data);
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
