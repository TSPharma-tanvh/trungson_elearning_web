import { DateTimeUtils } from '@/utils/date-time-utils';
import { type ApproveStatusEnum, type StatusEnum, type UserProgressEnum } from '@/utils/enum/core-enum';

export class CreateUserQuizRequest {
  quizID!: string;
  userIDs!: string[];
  startTime?: Date;
  endTime?: Date;
  progressStatus!: UserProgressEnum;
  activeStatus!: StatusEnum;
  enrollmentCriteriaID?: string;
  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  constructor(init?: Partial<CreateUserQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateUserQuizRequest {
    const dto = new CreateUserQuizRequest();
    dto.quizID = json.quizID;
    dto.userIDs = json.userIDs;
    dto.startTime = json.startTime ? new Date(json.startTime) : undefined;
    dto.endTime = json.endTime ? new Date(json.endTime) : undefined;
    dto.progressStatus = json.progressStatus ?? 0;
    dto.activeStatus = json.activeStatus ?? 0;
    dto.enrollmentCriteriaID = json.enrollmentCriteriaID;
    dto.userID = json.userID;
    dto.enrollStatus = json.enrollStatus;
    dto.approvedBy = json.approvedBy;
    dto.approvedAt = json.approvedAt ? new Date(json.approvedAt) : undefined;
    dto.rejectedReason = json.rejectedReason;
    return dto;
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      userIDs: this.userIDs,
      startTime: DateTimeUtils.formatISODateToString(this.startTime),
      endTime: DateTimeUtils.formatISODateToString(this.endTime),
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
    };
  }

  toFormData(): FormData {
    const form = new FormData();
    form.append('quizID', this.quizID);
    this.userIDs.forEach((uid) => {
      form.append('userIDs', uid);
    });
    const formattedStartTime = DateTimeUtils.formatISODateToString(this.startTime);
    if (formattedStartTime !== undefined) form.append('startTime', formattedStartTime);
    const formattedEndTime = DateTimeUtils.formatISODateToString(this.endTime);
    if (formattedEndTime !== undefined) form.append('endTime', formattedEndTime);
    form.append('progressStatus', this.progressStatus.toString());
    form.append('activeStatus', this.activeStatus.toString());
    if (this.enrollmentCriteriaID) form.append('enrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.userID) form.append('userID', this.userID);
    if (this.enrollStatus !== undefined) form.append('enrollStatus', this.enrollStatus.toString());
    if (this.approvedBy) form.append('approvedBy', this.approvedBy);
    if (this.approvedAt) form.append('approvedAt', this.approvedAt.toISOString());
    if (this.rejectedReason) form.append('rejectedReason', this.rejectedReason);
    return form;
  }
}
