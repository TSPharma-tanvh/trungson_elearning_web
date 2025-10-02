import { DateTimeUtils } from '@/utils/date-time-utils';
import { type ApproveStatusEnum, type UserProgressEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToPathRequest {
  userIDs: string[] = [];
  pathID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: UserProgressEnum;
  enrollmentCriteriaID?: string;
  quizEnrollmentCriteriaID?: string;
  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  constructor(init?: Partial<EnrollUserListToPathRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollUserListToPathRequest {
    return new EnrollUserListToPathRequest({
      userIDs: json.userIDs ?? [],
      pathID: json.pathID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      quizEnrollmentCriteriaID: json.quizEnrollmentCriteriaID,
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
      pathID: this.pathID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      quizEnrollmentCriteriaID: this.quizEnrollmentCriteriaID,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
    };
  }
}
