import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { CourseDetailResponse } from '../../courses/response/course-detail-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserCourseProgressResponse {
  id: string = '';
  userID?: string;
  courseID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status: string = '';
  enrollmentID?: string;
  enrollment?: EnrollmentResponse;
  courses?: CourseDetailResponse;
  user?: UserDetailResponse;

  constructor(init?: Partial<UserCourseProgressResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UserCourseProgressResponse {
    return new UserCourseProgressResponse({
      ...data,
      courses: data.courses ? CourseDetailResponse.fromJSON(data.courses) : undefined,
      user: data.user ? UserDetailResponse.fromJSON(data.user) : undefined,
      enrollment: data.enrollment ? EnrollmentResponse.fromJson(data.user) : undefined,
    });
  }

  toJSON(): any {
    return {
      ...this,
      courses: this.courses?.toJSON(),
      user: this.user?.toJSON(),
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
