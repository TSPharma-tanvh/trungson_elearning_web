import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  type ApproveStatusEnum,
  type ProgressEnrollmentTypeEnum,
  type StatusEnum,
  type UserProgressEnum,
} from '@/utils/enum/core-enum';

export class EnrollUserListToPathRequest {
  userIDs: string[] = [];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum;
  pathID!: string;
  progress?: number;

  startDate!: Date;
  endDate!: Date;

  isAutoEnroll = true;
  isUpdateOldProgress = false;

  status!: UserProgressEnum;
  activeStatus!: StatusEnum;
  enrollmentCriteriaID!: string;

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
      userFile: json.userFile,
      enrollType: json.enrollType,
      pathID: json.pathID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      isAutoEnroll: json.isAutoEnroll ?? true,
      isUpdateOldProgress: json.isUpdateOldProgress ?? false,
      status: json.status,
      activeStatus: json.activeStatus,
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
      enrollType: this.enrollType,
      pathID: this.pathID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      isAutoEnroll: this.isAutoEnroll,
      isUpdateOldProgress: this.isUpdateOldProgress,
      status: this.status,
      activeStatus: this.activeStatus,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: DateTimeUtils.formatISODateToString(this.approvedAt),
      rejectedReason: this.rejectedReason,
      userFile: this.userFile,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    if (this.userIDs?.length) {
      this.userIDs.forEach((id, index) => {
        formData.append(`userIDs[${index}]`, id);
      });
    }

    if (this.enrollType) formData.append('enrollType', this.enrollType.toString());
    if (this.pathID) formData.append('pathID', this.pathID);
    if (this.progress !== undefined) formData.append('progress', this.progress.toString());

    const startDateStr = DateTimeUtils.formatISODateToString(this.startDate);
    if (startDateStr) formData.append('startDate', startDateStr);

    const endDateStr = DateTimeUtils.formatISODateToString(this.endDate);
    if (endDateStr) formData.append('endDate', endDateStr);

    formData.append('isAutoEnroll', this.isAutoEnroll.toString());
    formData.append('isUpdateOldProgress', this.isUpdateOldProgress.toString());

    if (this.status) formData.append('status', this.status.toString());
    if (this.activeStatus) formData.append('activeStatus', this.activeStatus.toString());
    if (this.enrollmentCriteriaID) formData.append('enrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.userID) formData.append('userID', this.userID);
    if (this.enrollStatus) formData.append('enrollStatus', this.enrollStatus.toString());
    if (this.approvedBy) formData.append('approvedBy', this.approvedBy);

    const approvedAtStr = this.approvedAt ? DateTimeUtils.formatISODateToString(this.approvedAt) : undefined;
    if (approvedAtStr) formData.append('approvedAt', approvedAtStr);

    if (this.rejectedReason) formData.append('rejectedReason', this.rejectedReason);
    if (this.userFile) formData.append('userFile', this.userFile);

    return formData;
  }
}
