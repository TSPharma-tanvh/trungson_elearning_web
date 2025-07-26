import { CheckinTimeEnum } from '@/utils/enum/core-enum';

export class GetAttendanceRecordsResponse {
  userID?: string;
  levelID?: string;
  classID?: string;
  checkinTimeFrom?: Date;
  checkinTimeTo?: Date;
  status?: CheckinTimeEnum = CheckinTimeEnum.OnTime;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  static fromJSON(json: any): GetAttendanceRecordsResponse {
    const dto = new GetAttendanceRecordsResponse();
    dto.userID = json.userID;
    dto.levelID = json.levelID;
    dto.classID = json.classID;
    dto.checkinTimeFrom = json.checkinTimeFrom ? new Date(json.checkinTimeFrom) : undefined;
    dto.checkinTimeTo = json.checkinTimeTo ? new Date(json.checkinTimeTo) : undefined;
    dto.status = json.status;
    dto.searchText = json.searchText;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJSON(): any {
    return {
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      checkinTimeFrom: this.checkinTimeFrom?.toISOString(),
      checkinTimeTo: this.checkinTimeTo?.toISOString(),
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
