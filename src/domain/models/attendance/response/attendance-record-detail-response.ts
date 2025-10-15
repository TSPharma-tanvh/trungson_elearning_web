import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { UserResponse } from '../../user/response/user-response';

export class AttendanceRecordDetailResponse {
  id = '';
  userID?: string;
  levelID?: string;
  classID?: string;
  pathID?: string;

  startAt?: Date;
  endAt?: Date;
  checkInTime?: Date;
  checkOutTime?: Date;

  minuteLate?: number;
  minuteSoon?: number;

  statusCheckIn?: string;
  statusCheckOut?: string;
  activeStatus?: string;

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
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      checkInTime: json.checkInTime ? new Date(json.checkInTime) : undefined,
      checkOutTime: json.checkOutTime ? new Date(json.checkOutTime) : undefined,
      minuteLate: json.minuteLate,
      minuteSoon: json.minuteSoon,
      statusCheckIn: json.statusCheckIn,
      statusCheckOut: json.statusCheckOut,
      activeStatus: json.activeStatus,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      user: json.user ? UserResponse.fromJson(json.user) : undefined,
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
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
      checkInTime: this.checkInTime?.toISOString(),
      checkOutTime: this.checkOutTime?.toISOString(),
      minuteLate: this.minuteLate,
      minuteSoon: this.minuteSoon,
      statusCheckIn: this.statusCheckIn,
      statusCheckOut: this.statusCheckOut,
      activeStatus: this.activeStatus,
      class: this.class?.toJson(),
      user: this.user?.toJson(),
      enrollment: this.enrollment?.toJson(),
    };
  }
}
