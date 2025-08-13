import { DateTimeUtils } from '@/utils/date-time-utils';
import { type ApproveStatusEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToClassRequest {
  userIDs: string[] = [];
  classID!: string;
  levelID?: string;
  checkInTime?: Date;
  startAt!: Date;
  endAt!: Date;
  minuteLate!: number;
  minuteSoon!: number;
  statusCheckIn?: string;
  enrollmentCriteriaID?: string;
  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  constructor(init?: Partial<EnrollUserListToClassRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollUserListToClassRequest {
    return new EnrollUserListToClassRequest({
      userIDs: json.userIDs || [],
      classID: json.classID,
      levelID: json.levelID,
      checkInTime: json.checkInTime ? new Date(json.checkInTime) : undefined,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      minuteSoon: json.minuteSoon,
      statusCheckIn: json.statusCheckIn,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      userID: json.userID,
      enrollStatus: json.enrollStatus,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
    });
  }

  toJson(): any {
    return {
      userIDs: this.userIDs,
      classID: this.classID,
      levelID: this.levelID,
      checkInTime: this.checkInTime ? DateTimeUtils.formatISODateToString(this.checkInTime) : undefined,
      startAt: this.startAt ? DateTimeUtils.formatISODateToString(this.startAt) : undefined,
      endAt: this.endAt ? DateTimeUtils.formatISODateToString(this.endAt) : undefined,
      minuteLate: this.minuteLate,
      minuteSoon: this.minuteSoon,
      statusCheckIn: this.statusCheckIn,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt ? DateTimeUtils.formatISODateToString(this.approvedAt) : undefined,
      rejectedReason: this.rejectedReason,
    };
  }
}
