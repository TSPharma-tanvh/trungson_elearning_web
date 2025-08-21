import { DateTimeUtils } from '@/utils/date-time-utils';

export class UpdateAttendanceRecordsRequest {
  id!: string;
  userID?: string;
  levelID?: string;
  classID?: string;

  startAt?: Date;
  endAt?: Date;
  minuteLate?: number;
  minuteSoon?: number;

  checkInTime?: Date;
  checkOutTime?: Date;
  statusCheckIn?: string;
  statusCheckOut?: string;

  constructor(init?: Partial<UpdateAttendanceRecordsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateAttendanceRecordsRequest {
    const dto = new UpdateAttendanceRecordsRequest();
    dto.id = json.id;
    dto.userID = json.userID;
    dto.levelID = json.levelID;
    dto.classID = json.classID;

    dto.startAt = json.startAt ? new Date(json.startAt) : undefined;
    dto.endAt = json.endAt ? new Date(json.endAt) : undefined;
    dto.minuteLate = json.minuteLate;
    dto.minuteSoon = json.minuteSoon;

    dto.checkInTime = json.checkInTime ? new Date(json.checkInTime) : undefined;
    dto.checkOutTime = json.checkOutTime ? new Date(json.checkOutTime) : undefined;
    dto.statusCheckIn = json.statusCheckIn;
    dto.statusCheckOut = json.statusCheckOut;

    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,

      startAt: this.startAt ? DateTimeUtils.formatISODateToString(this.startAt) : undefined,
      endAt: this.endAt ? DateTimeUtils.formatISODateToString(this.endAt) : undefined,
      minuteLate: this.minuteLate,
      minuteSoon: this.minuteSoon,

      checkInTime: this.checkInTime ? DateTimeUtils.formatISODateToString(this.checkInTime) : undefined,
      checkOutTime: this.checkOutTime ? DateTimeUtils.formatISODateToString(this.checkOutTime) : undefined,
      statusCheckIn: this.statusCheckIn,
      statusCheckOut: this.statusCheckOut,
    };
  }
}
