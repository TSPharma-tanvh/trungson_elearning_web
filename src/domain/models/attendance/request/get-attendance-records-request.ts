import { type CheckinTimeEnum } from '@/utils/enum/core-enum';

export class GetAttendanceRecordsRequest {
  userID?: string;
  levelID?: string;
  classID?: string;
  enrollmentCriteriaId?: string;
  checkinTimeFrom?: Date;
  checkinTimeTo?: Date;
  status?: CheckinTimeEnum;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetAttendanceRecordsRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetAttendanceRecordsRequest {
    const dto = new GetAttendanceRecordsRequest();
    dto.userID = json.userID;
    dto.levelID = json.levelID;
    dto.classID = json.classID;
    dto.enrollmentCriteriaId = json.enrollmentCriteriaId;
    dto.checkinTimeFrom = json.checkinTimeFrom ? new Date(json.checkinTimeFrom) : undefined;
    dto.checkinTimeTo = json.checkinTimeTo ? new Date(json.checkinTimeTo) : undefined;
    dto.status = json.status;
    dto.searchText = json.searchText;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      levelID: this.levelID,
      classID: this.classID,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      checkinTimeFrom: this.checkinTimeFrom?.toISOString(),
      checkinTimeTo: this.checkinTimeTo?.toISOString(),
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
