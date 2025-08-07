import { CoursePathResponse } from '../../path/response/course-path-response';
import { UserCourseProgressResponse } from '../../user-course/response/user-course-progress-response';
import { UserLessonProgressDetailResponse } from '../../user-lesson/response/user-lesson-detail-response';
import { UserQuizProgressionResponse } from '../../user-quiz/response/user-quiz-progress-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserPathProgressDetailResponse {
  id?: string;
  userID?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status = '';
  enrollmentID?: string;

  coursePath?: CoursePathResponse;
  user?: UserDetailResponse;

  userCourseProgressResponse?: UserCourseProgressResponse[];
  userLessonProgressResponse?: UserLessonProgressDetailResponse[];
  userQuizProgressResponse?: UserQuizProgressionResponse[];

  constructor(init?: Partial<UserPathProgressDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UserPathProgressDetailResponse {
    return new UserPathProgressDetailResponse({
      ...data,
      coursePath: data.coursePath ? CoursePathResponse.fromJson(data.coursePath) : undefined,
      user: data.user ? UserDetailResponse.fromJSON(data.user) : undefined,
      userCourseProgressResponse: Array.isArray(data.userCourseProgressResponse)
        ? data.userCourseProgressResponse.map((x: any) => UserCourseProgressResponse.fromJSON(x))
        : [],
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
      coursePath: this.coursePath?.toJson(),
      user: this.user?.toJSON(),
      userCourseProgressResponse: this.userCourseProgressResponse?.map((x) => x.toJSON()),
      userLessonProgressResponse: this.userLessonProgressResponse?.map((x) => x.toJSON()),
      userQuizProgressResponse: this.userQuizProgressResponse?.map((x) => x.toJSON()),
    };
  }
}
