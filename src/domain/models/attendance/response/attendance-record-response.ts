export class AttendanceRecordResponse {
  id: string = '';
  userID?: string;
  levelID?: string;
  classID?: string;
  pathID?: string;
  checkinTime?: Date;
  status?: string;

  constructor(init?: Partial<AttendanceRecordResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AttendanceRecordResponse {
    return new AttendanceRecordResponse({
      id: json.id,
      userID: json.userID,
      levelID: json.levelID,
      classID: json.classID,
      pathID: json.pathID,
      checkinTime: json.checkinTime ? new Date(json.checkinTime) : undefined,
      status: json.status,
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
    };
  }
}
