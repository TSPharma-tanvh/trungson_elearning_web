import { CourseDetailResponse } from '../../courses/response/course-detail-response';

export class UserCourseProgressResponse {
  id: string = '';
  userID?: string;
  courseID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status: string = '';
  courses?: CourseDetailResponse;

  constructor(init?: Partial<UserCourseProgressResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UserCourseProgressResponse {
    return new UserCourseProgressResponse({
      ...data,
      courses: data.courses ? CourseDetailResponse.fromJSON(data.courses) : undefined,
    });
  }

  toJSON(): any {
    return {
      ...this,
      courses: this.courses?.toJSON(),
    };
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
