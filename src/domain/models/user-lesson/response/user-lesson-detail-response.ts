import { LessonDetailResponse } from '../../lessons/response/lesson-detail-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserLessonProgressDetailResponse {
  id?: string;
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: string;
  lessons?: LessonDetailResponse;
  user?: UserDetailResponse;

  constructor(init?: Partial<UserLessonProgressDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserLessonProgressDetailResponse {
    return new UserLessonProgressDetailResponse({
      id: json.id,
      userID: json.userID,
      lessonID: json.lessonID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      lessons: json.lessons ? LessonDetailResponse.fromJSON(json.lessons) : undefined,
      user: json.user ? UserDetailResponse.fromJSON(json.user) : undefined,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      lessons: this.lessons?.toJSON(),
      user: this.user?.toJSON(),
    };
  }
}
