import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { CourseDetailResponse } from '../../courses/response/course-detail-response';
import { UserLessonProgressDetailResponse } from '../../user-lesson/response/user-lesson-detail-response';
import { UserQuizProgressionResponse } from '../../user-quiz/response/user-quiz-progress-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserCourseProgressResponse {
  id = '';
  userID?: string;
  courseID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status = '';
  enrollmentID?: string;
  enrollment?: EnrollmentResponse;
  courses?: CourseDetailResponse;
  user?: UserDetailResponse;
  userLessonProgressResponse?: UserLessonProgressDetailResponse[];
  userQuizProgressResponse?: UserQuizProgressionResponse[];

  constructor(init?: Partial<UserCourseProgressResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UserCourseProgressResponse {
    return new UserCourseProgressResponse({
      ...data,
      courses: data.courses ? CourseDetailResponse.fromJSON(data.courses) : undefined,
      user: data.user ? UserDetailResponse.fromJSON(data.user) : undefined,
      enrollment: data.enrollment ? EnrollmentResponse.fromJson(data.user) : undefined,
      userLessonProgressResponse: Array.isArray(data.userLessonProgressResponse)
        ? data.userLessonProgressResponse.map((x: any) => UserLessonProgressDetailResponse.fromJSON(x))
        : [],
      userQuizProgressResponse: Array.isArray(data.userQuizProgressResponse)
        ? data.userQuizProgressResponse.map((x: any) => UserQuizProgressionResponse.fromJSON(x))
        : [],
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
