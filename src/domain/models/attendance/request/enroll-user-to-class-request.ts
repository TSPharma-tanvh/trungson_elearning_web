import { DateTimeUtils } from '@/utils/date-time-utils';
import { type StatusEnum, type ApproveStatusEnum, type ProgressEnrollmentTypeEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToClassRequest {
  userIDs: string[] = [];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum;
  classID!: string;
  levelID?: string;
  checkInTime?: Date;

  startAt!: Date;
  endAt!: Date;

  minuteLate!: number;
  minuteSoon!: number;

  statusCheckIn!: string;
  enrollmentCriteriaID?: string;

  activeStatus!: StatusEnum;

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
      userFile: json.userFile,
      enrollType: json.enrollType,
      classID: json.classID,
      levelID: json.levelID,
      checkInTime: json.checkInTime ? new Date(json.checkInTime) : undefined,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      minuteSoon: json.minuteSoon,
      statusCheckIn: json.statusCheckIn,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      activeStatus: json.activeStatus,
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
      // file gửi riêng qua FormData nếu có upload
      enrollType: this.enrollType,
      classID: this.classID,
      levelID: this.levelID,
      checkInTime: this.checkInTime ? DateTimeUtils.formatISODateToString(this.checkInTime) : undefined,
      startAt: this.startAt ? DateTimeUtils.formatISODateToString(this.startAt) : undefined,
      endAt: this.endAt ? DateTimeUtils.formatISODateToString(this.endAt) : undefined,
      minuteLate: this.minuteLate,
      minuteSoon: this.minuteSoon,
      statusCheckIn: this.statusCheckIn,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      activeStatus: this.activeStatus,
      userID: this.userID,
      enrollStatus: this.enrollStatus,
      approvedBy: this.approvedBy,
      approvedAt: this.approvedAt ? DateTimeUtils.formatISODateToString(this.approvedAt) : undefined,
      rejectedReason: this.rejectedReason,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    if (this.userIDs?.length) {
      this.userIDs.forEach((id) => { formData.append('UserIDs', id); });
    }

    if (this.userFile) {
      formData.append('UserFile', this.userFile);
    }

    formData.append('EnrollType', String(this.enrollType));
    formData.append('ClassID', this.classID);

    if (this.levelID) formData.append('LevelID', this.levelID);

    const checkInTimeStr = DateTimeUtils.formatISODateToString(this.checkInTime);
    if (checkInTimeStr) formData.append('CheckInTime', checkInTimeStr);

    const startAtStr = DateTimeUtils.formatISODateToString(this.startAt);
    if (startAtStr) formData.append('StartAt', startAtStr);

    const endAtStr = DateTimeUtils.formatISODateToString(this.endAt);
    if (endAtStr) formData.append('EndAt', endAtStr);

    formData.append('MinuteLate', String(this.minuteLate));
    formData.append('MinuteSoon', String(this.minuteSoon));
    formData.append('StatusCheckIn', this.statusCheckIn);

    if (this.enrollmentCriteriaID) formData.append('EnrollmentCriteriaID', this.enrollmentCriteriaID);

    formData.append('ActiveStatus', String(this.activeStatus));

    if (this.userID) formData.append('UserID', this.userID);
    if (this.enrollStatus !== undefined && this.enrollStatus !== null)
      formData.append('EnrollStatus', String(this.enrollStatus));
    if (this.approvedBy) formData.append('ApprovedBy', this.approvedBy);

    const approvedAtStr = DateTimeUtils.formatISODateToString(this.approvedAt);
    if (approvedAtStr) formData.append('ApprovedAt', approvedAtStr);

    if (this.rejectedReason) formData.append('RejectedReason', this.rejectedReason);

    return formData;
  }
}
