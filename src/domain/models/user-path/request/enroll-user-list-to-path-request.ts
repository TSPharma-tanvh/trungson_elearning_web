import { DateTimeUtils } from '@/utils/date-time-utils';
import {
  type ApproveStatusEnum,
  type ProgressEnrollmentTypeEnum,
  type StatusEnum,
  type UserProgressEnum,
} from '@/utils/enum/core-enum';

export class EnrollUserListToPathRequest {
  userIDs: string[] = [];
  enrollType!: ProgressEnrollmentTypeEnum;
  pathID!: string;
  progress?: number;
  startDate!: Date;
  endDate!: Date;
  lastAccess?: Date;
  status!: UserProgressEnum;
  activeStatus!: StatusEnum;
  enrollmentCriteriaID!: string;
  userID?: string;
  enrollStatus?: ApproveStatusEnum;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
  userFile?: File;

  constructor(init?: Partial<EnrollUserListToPathRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollUserListToPathRequest {
    return new EnrollUserListToPathRequest({
      userIDs: json.userIDs ?? [],
      enrollType: json.enrollType,
      pathID: json.pathID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      activeStatus: json.activeStatus,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      userID: json.userID,
      enrollStatus: json.enrollStatus,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
      userFile: json.userFile,
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
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      activeStatus: this.activeStatus,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
      userFile: this.userFile,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    if (this.userIDs && this.userIDs.length > 0) {
      this.userIDs.forEach((id, index) => {
        formData.append(`userIDs[${index}]`, id);
      });
    }

    if (this.enrollType) formData.append('enrollType', this.enrollType.toString());
    if (this.pathID) formData.append('pathID', this.pathID);
    if (this.progress !== undefined) formData.append('progress', this.progress.toString());

    const startDateStr = this.startDate ? DateTimeUtils.formatISODateToString(this.startDate) : undefined;
    if (startDateStr) formData.append('startDate', startDateStr);

    const endDateStr = this.endDate ? DateTimeUtils.formatISODateToString(this.endDate) : undefined;
    if (endDateStr) formData.append('endDate', endDateStr);

    const lastAccessStr = this.lastAccess ? DateTimeUtils.formatISODateToString(this.lastAccess) : undefined;
    if (lastAccessStr) formData.append('lastAccess', lastAccessStr);

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
