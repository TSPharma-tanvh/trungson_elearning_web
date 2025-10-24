import { DateTimeUtils } from '@/utils/date-time-utils';
import { ApproveStatusEnum, ProgressEnrollmentTypeEnum, StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToCourseRequest {
  userIDs: string[] = [];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum;
  courseID!: string;
  progress?: number;

  startDate!: Date;
  endDate!: Date;

  isAutoEnroll: boolean = true;
  isUpdateOldProgress: boolean = false;

  lastAccess?: Date;

  status!: UserProgressEnum;
  activeStatus: StatusEnum = StatusEnum.Enable;

  enrollmentCriteriaID?: string;
  userID?: string;
  approvedBy?: string;
  approvedAt?: Date;
  rejectedReason?: string;
  enrollStatus?: ApproveStatusEnum;

  constructor(init?: Partial<EnrollUserListToCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollUserListToCourseRequest {
    return new EnrollUserListToCourseRequest({
      userIDs: json.userIDs ?? [],
      userFile: json.userFile,
      enrollType: json.enrollType,
      courseID: json.courseID,
      progress: json.progress,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      isAutoEnroll: json.isAutoEnroll ?? true,
      isUpdateOldProgress: json.isUpdateOldProgress ?? false,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      activeStatus: json.activeStatus ?? StatusEnum.Enable,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      userID: json.userID,
      approvedBy: json.approvedBy,
      approvedAt: json.approvedAt ? new Date(json.approvedAt) : undefined,
      rejectedReason: json.rejectedReason,
      enrollStatus: json.enrollStatus,
    });
  }

  toJson(): any {
    return {
      userIDs: this.userIDs,
      enrollType: this.enrollType,
      courseID: this.courseID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      isAutoEnroll: this.isAutoEnroll,
      isUpdateOldProgress: this.isUpdateOldProgress,
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      activeStatus: this.activeStatus,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      userID: this.userID,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt?.toISOString(),
      rejectedReason: this.rejectedReason,
      enrollStatus: this.enrollStatus,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    if (this.userIDs?.length) {
      this.userIDs.forEach((id, i) => formData.append(`UserIDs[${i}]`, id));
    }

    formData.append('EnrollType', this.enrollType.toString());
    formData.append('CourseID', this.courseID);
    const startDateStr = DateTimeUtils.formatISODateToString(this.startDate);
    if (startDateStr) formData.append('StartDate', startDateStr);

    const endDateStr = DateTimeUtils.formatISODateToString(this.endDate);
    if (endDateStr) formData.append('EndDate', endDateStr);
    formData.append('IsAutoEnroll', this.isAutoEnroll.toString());
    formData.append('IsUpdateOldProgress', this.isUpdateOldProgress.toString());
    formData.append('Status', this.status.toString());
    formData.append('ActiveStatus', this.activeStatus.toString());

    if (this.progress !== undefined) formData.append('Progress', this.progress.toString());
    if (this.lastAccess) formData.append('LastAccess', this.lastAccess.toISOString());
    if (this.enrollmentCriteriaID) formData.append('EnrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.userID) formData.append('UserID', this.userID);
    if (this.approvedBy) formData.append('ApprovedBy', this.approvedBy);
    if (this.approvedAt) formData.append('ApprovedAt', this.approvedAt.toISOString());
    if (this.rejectedReason) formData.append('RejectedReason', this.rejectedReason);
    if (this.enrollStatus !== undefined) formData.append('EnrollStatus', this.enrollStatus.toString());

    if (this.userFile) formData.append('UserFile', this.userFile);

    return formData;
  }
}
