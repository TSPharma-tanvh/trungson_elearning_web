import { ClassResponse } from '../../class/response/class-response';
import { UserResponse } from '../../user/response/user-response';

export class AttendanceRecordDetailResponse {
  id: string = '';
  userID?: string;
  levelID?: string;
  classID?: string;
  pathID?: string;
  checkinTime?: Date;
  status?: string;
  class?: ClassResponse;
  user?: UserResponse;

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
      status: json.status,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      user: json.user ? UserResponse.fromJSON(json.user) : undefined,
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
      status: this.status,
      class: this.class?.toJson(),
      user: this.user?.toJSON(),
    };
  }
}
