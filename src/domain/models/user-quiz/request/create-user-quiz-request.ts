import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  type ApproveStatusEnum,
  type ProgressEnrollmentTypeEnum,
  StatusEnum,
  UserQuizProgressEnum, // 👈 use UserQuizProgressEnum (not UserProgressEnum)
} from '@/utils/enum/core-enum';

export class CreateUserQuizRequest {
  quizID!: string;
  userIDs?: string[];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum;
  startTime!: Date;
  endTime!: Date;

  progressStatus!: UserQuizProgressEnum;
  activeStatus: StatusEnum = StatusEnum.Enable;
  enrollmentCriteriaID!: string;

  isAutoEnroll = true;
  isUpdateOldProgress = false;

  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  constructor(init?: Partial<CreateUserQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateUserQuizRequest {
    return new CreateUserQuizRequest({
      quizID: json.quizID,
      userIDs: json.userIDs ?? [],
      userFile: json.userFile,
      enrollType: json.enrollType,
      startTime: json.startTime ? new Date(json.startTime) : undefined,
      endTime: json.endTime ? new Date(json.endTime) : undefined,
      progressStatus: json.progressStatus ?? UserQuizProgressEnum.NotStarted,
      activeStatus: json.activeStatus ?? StatusEnum.Enable,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      isAutoEnroll: json.isAutoEnroll ?? true,
      isUpdateOldProgress: json.isUpdateOldProgress ?? false,
      userID: json.userID,
      enrollStatus: json.enrollStatus,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
    });
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      userIDs: this.userIDs,
      enrollType: this.enrollType,
      startTime: DateTimeUtils.formatISODateToString(this.startTime),
      endTime: DateTimeUtils.formatISODateToString(this.endTime),
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      isAutoEnroll: this.isAutoEnroll,
      isUpdateOldProgress: this.isUpdateOldProgress,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    form.append('QuizID', this.quizID);
    if (this.userIDs?.length) {
      this.userIDs.forEach((uid, index) => { form.append(`UserIDs[${index}]`, uid); });
    }

    if (this.userFile) form.append('UserFile', this.userFile);

    form.append('EnrollType', this.enrollType.toString());
    const startDateStr = DateTimeUtils.formatISODateToString(this.startTime);
    if (startDateStr) form.append('startTime', startDateStr);

    const endDateStr = DateTimeUtils.formatISODateToString(this.endTime);
    if (endDateStr) form.append('endTime', endDateStr);

    form.append('ProgressStatus', this.progressStatus.toString());
    form.append('ActiveStatus', this.activeStatus.toString());

    form.append('IsAutoEnroll', this.isAutoEnroll.toString());
    form.append('IsUpdateOldProgress', this.isUpdateOldProgress.toString());

    if (this.enrollmentCriteriaID) form.append('EnrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.userID) form.append('UserID', this.userID);
    if (this.enrollStatus !== undefined) form.append('EnrollStatus', this.enrollStatus.toString());
    if (this.approvedBy) form.append('ApprovedBy', this.approvedBy);
    if (this.approvedAt) form.append('ApprovedAt', this.approvedAt.toISOString());
    if (this.rejectedReason) form.append('RejectedReason', this.rejectedReason);

    return form;
  }
}
