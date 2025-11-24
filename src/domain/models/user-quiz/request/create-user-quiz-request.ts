import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  StatusEnum,
  UserQuizProgressEnum,
  type ApproveStatusEnum,
  type ProgressEnrollmentTypeEnum,
} from '@/utils/enum/core-enum';

export class CreateUserQuizRequest {
  quizID!: string;
  userIDs?: string[];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum;

  progressStatus: UserQuizProgressEnum = UserQuizProgressEnum.NotStarted;
  activeStatus: StatusEnum = StatusEnum.Enable;

  enrollmentCriteriaID?: string;

  isAutoEnroll: boolean = true;
  isUpdateOldProgress: boolean = false;

  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;

  fixedQuizStartDate?: Date;

  constructor(init?: Partial<CreateUserQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateUserQuizRequest {
    return new CreateUserQuizRequest({
      quizID: json.quizID,
      userIDs: json.userIDs ?? [],
      userFile: json.userFile,
      enrollType: json.enrollType,

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

      fixedQuizStartDate: json.fixedQuizStartDate ? new Date(json.fixedQuizStartDate) : undefined,
    });
  }

  toFormData(): FormData {
    const form = new FormData();

    form.append('QuizID', this.quizID);

    this.userIDs?.forEach((uid, index) => {
      form.append(`UserIDs[${index}]`, uid);
    });

    if (this.userFile) form.append('UserFile', this.userFile);

    form.append('EnrollType', this.enrollType.toString());
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

    if (this.fixedQuizStartDate) form.append('FixedQuizStartDate', this.fixedQuizStartDate.toISOString());

    return form;
  }
}
