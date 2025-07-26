import { DateTimeUtils } from '@/utils/date-time-utils';
import { type ApproveStatusEnum, type UserProgressEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToCourseRequest {
  userIDs: string[] = [];
  courseID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: UserProgressEnum;
  enrollmentCriteriaID?: string;
  userID?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
  enrollStatus?: ApproveStatusEnum;

  constructor(init?: Partial<EnrollUserListToCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): EnrollUserListToCourseRequest {
    return new EnrollUserListToCourseRequest({
      userIDs: json.userIDs ?? [],
      courseID: json.courseID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      userID: json.userID,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
      enrollStatus: json.enrollStatus,
    });
  }

  toJSON(): any {
    return {
      userIDs: this.userIDs,
      courseID: this.courseID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
      enrollStatus: this.enrollStatus,
    };
  }
}
