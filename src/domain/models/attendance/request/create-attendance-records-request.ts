import { CheckinTimeEnum } from '@/utils/enum/core-enum';

export class CreateAttendanceRecordsRequest {
  userID?: string;
  levelID?: string;
  classID?: string;
  checkinTime?: Date;
  status: CheckinTimeEnum = CheckinTimeEnum.OnTime;

  constructor(init?: Partial<CreateAttendanceRecordsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateAttendanceRecordsRequest {
    const dto = new CreateAttendanceRecordsRequest();
    dto.userID = json.userID;
    dto.levelID = json.levelID;
    dto.classID = json.classID;
    dto.checkinTime = json.checkinTime ? new Date(json.checkinTime) : undefined;
    dto.status = json.status;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      checkinTime: this.checkinTime?.toISOString(),
      status: this.status,
    };
  }
}
