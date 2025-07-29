export class UpdateAttendanceRecordsRequest {
  id!: string;
  userID?: string;
  levelID?: string;
  classID?: string;
  checkinTime?: Date;
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
    dto.status = json.status;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      checkinTime: this.checkinTime?.toISOString(),
      status: this.status,
    };
  }
}
