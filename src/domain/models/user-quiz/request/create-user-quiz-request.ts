import { type ApproveStatusEnum, type StatusEnum, type UserProgressEnum } from '@/utils/enum/core-enum';

export class CreateUserQuizRequest {
  quizID!: string;
  userIDs!: string[];
  assignedAt!: Date;
  customStartTime?: Date;
  customEndTime?: Date;
  progressStatus!: UserProgressEnum;
  activeStatus!: StatusEnum;
  isAutoSubmitted!: boolean;
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
    dto.assignedAt = new Date(json.assignedAt);
    dto.customStartTime = json.customStartTime ? new Date(json.customStartTime) : undefined;
    dto.customEndTime = json.customEndTime ? new Date(json.customEndTime) : undefined;
    dto.progressStatus = json.progressStatus ?? 0;
    dto.activeStatus = json.activeStatus ?? 0;
    dto.isAutoSubmitted = json.isAutoSubmitted ?? true;
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
      assignedAt: this.assignedAt.toISOString(),
      customStartTime: this.customStartTime?.toISOString(),
      customEndTime: this.customEndTime?.toISOString(),
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      isAutoSubmitted: this.isAutoSubmitted,
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
    this.userIDs.forEach((uid) => { form.append('userIDs', uid); });
    form.append('assignedAt', this.assignedAt.toISOString());
    if (this.customStartTime) form.append('customStartTime', this.customStartTime.toISOString());
    if (this.customEndTime) form.append('customEndTime', this.customEndTime.toISOString());
    form.append('progressStatus', this.progressStatus.toString());
    form.append('activeStatus', this.activeStatus.toString());
    form.append('isAutoSubmitted', this.isAutoSubmitted.toString());
    if (this.enrollmentCriteriaID) form.append('enrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.userID) form.append('userID', this.userID);
    if (this.enrollStatus != null) form.append('enrollStatus', this.enrollStatus.toString());
    if (this.approvedBy) form.append('approvedBy', this.approvedBy);
    if (this.approvedAt) form.append('approvedAt', this.approvedAt.toISOString());
    if (this.rejectedReason) form.append('rejectedReason', this.rejectedReason);
    return form;
  }
}
