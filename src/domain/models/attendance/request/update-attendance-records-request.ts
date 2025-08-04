import { DateTimeUtils } from "@/utils/date-time-utils";

export class UpdateAttendanceRecordsRequest {
  id!: string;
  userID?: string;
  levelID?: string;
  classID?: string;
  checkinTime?: Date;
  startAt?: Date;
  endAt?: Date;
  minuteLate?: number;
  status?: string;

  constructor(init?: Partial<UpdateAttendanceRecordsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateAttendanceRecordsRequest {
    const dto = new UpdateAttendanceRecordsRequest();
    dto.id = json.id;
    dto.userID = json.userID;
    dto.levelID = json.levelID;
    dto.classID = json.classID;
    dto.checkinTime = json.checkinTime ? new Date(json.checkinTime) : undefined;
    dto.startAt = json.startAt ? new Date(json.startAt) : undefined;
    dto.endAt = json.endAt ? new Date(json.endAt) : undefined;
    dto.minuteLate = json.minuteLate;
    dto.status = json.status;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      checkinTime: this.checkinTime ? DateTimeUtils.formatISODateToString(this.checkinTime) : undefined,
      startAt: this.startAt ? DateTimeUtils.formatISODateToString(this.startAt) : undefined,
      endAt: this.endAt ? DateTimeUtils.formatISODateToString(this.endAt) : undefined,
      minuteLate: this.minuteLate,
      status: this.status,
    };
  }
}
