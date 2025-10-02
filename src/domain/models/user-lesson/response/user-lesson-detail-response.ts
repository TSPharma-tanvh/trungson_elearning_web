import { LessonDetailResponse } from '../../lessons/response/lesson-detail-response';
import { UserQuizProgressionResponse } from '../../user-quiz/response/user-quiz-progress-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserLessonProgressDetailResponse {
  id?: string;
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status!: string;
  lessons?: LessonDetailResponse;
  user?: UserDetailResponse;
  userQuizProgressResponse?: UserQuizProgressionResponse[];

  constructor(init?: Partial<UserLessonProgressDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserLessonProgressDetailResponse {
    return new UserLessonProgressDetailResponse({
      id: json.id,
      userID: json.userID,
      lessonID: json.lessonID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      lastAccess: json.lastAccess,
      actualStartDate: json.actualStartDate,
      actualEndDate: json.actualEndDate,
      status: json.status,
      lessons: json.lessons ? LessonDetailResponse.fromJson(json.lessons) : undefined,
      user: json.user ? UserDetailResponse.fromJson(json.user) : undefined,
      userQuizProgressResponse: Array.isArray(json.userQuizProgressResponse)
        ? json.userQuizProgressResponse.map((x: any) => UserQuizProgressionResponse.fromJson(x))
        : [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      lastAccess: this.lastAccess,
      actualStartDate: this.actualStartDate,
      actualEndDate: this.actualEndDate,
      status: this.status,
      lessons: this.lessons?.toJson(),
      user: this.user?.toJson(),
      userQuizProgressResponse: this.userQuizProgressResponse?.map((x) => x.toJson()),
    };
  }
}
