import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { UserResponse } from '../../user/response/user-response';

export class AttendanceRecordDetailResponse {
  id = '';
  userID?: string;
  levelID?: string;
  classID?: string;
  pathID?: string;
  checkinTime?: Date;
  startAt?: Date;
  endAt?: Date;
  minuteLate?: number;
  status?: string;
  class?: ClassResponse;
  user?: UserResponse;
  enrollment?: EnrollmentResponse;

  constructor(init?: Partial<AttendanceRecordDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AttendanceRecordDetailResponse {
    return new AttendanceRecordDetailResponse({
      id: json.id,
      userID: json.userID,
      levelID: json.levelID,
      classID: json.classID,
      pathID: json.pathID,
      checkinTime: json.checkinTime ? new Date(json.checkinTime) : undefined,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      status: json.status,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      user: json.user ? UserResponse.fromJSON(json.user) : undefined,
      enrollment: json.enrollment ? EnrollmentResponse.fromJson(json.enrollment) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      pathID: this.pathID,
      checkinTime: this.checkinTime?.toISOString(),
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
      minuteLate: this.minuteLate,
      status: this.status,
      class: this.class?.toJson(),
      user: this.user?.toJSON(),
      enrollment: this.enrollment?.toJson(),
    };
  }
}
