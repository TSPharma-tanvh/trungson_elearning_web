import { CoursePathResponse } from '../../path/response/course-path-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserPathProgressDetailResponse {
  id?: string;
  userID?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status: string = '';
  enrollmentID?: string;
  coursePath?: CoursePathResponse;
  user?: UserDetailResponse;

  constructor(init?: Partial<UserPathProgressDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(data: any): UserPathProgressDetailResponse {
    const dto = new UserPathProgressDetailResponse({
      ...data,
      coursePath: data.coursePath ? CoursePathResponse.fromJson(data.coursePath) : undefined,
      user: data.user ? UserDetailResponse.fromJSON(data.user) : undefined,
    });
    return dto;
  }

  toJSON(): any {
    return {
      ...this,
      coursePath: this.coursePath?.toJson(),
      user: this.user?.toJSON(),
    };
  }
}
