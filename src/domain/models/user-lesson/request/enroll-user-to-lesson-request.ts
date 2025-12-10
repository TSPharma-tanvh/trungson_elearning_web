import { DateTimeUtils } from '@/utils/date-time-utils';
import { ProgressEnrollmentTypeEnum, StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToLessonRequest {
  userIDs?: string[] | null;
  lessonID!: string;
  progress?: number | null;
  startDate?: Date;
  lastAccess?: string | null;
  status!: string;
  activeStatus!: StatusEnum;
  enrollType!: ProgressEnrollmentTypeEnum;
  userFile?: File | null;
  isUpdateOldProgress: boolean = false;

  constructor(init?: Partial<EnrollUserListToLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollUserListToLessonRequest {
    return new EnrollUserListToLessonRequest({
      userIDs: json.userIDs ?? null,
      lessonID: json.lessonID,
      progress: json.progress ?? null,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      lastAccess: json.lastAccess ?? null,
      status: json.status,
      activeStatus: json.activeStatus,
      enrollType: json.enrollType,
      userFile: null,
      isUpdateOldProgress: json.isUpdateOldProgress ?? false,
    });
  }

  toJson(): any {
    return {
      userIDs: this.userIDs,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      lastAccess: this.lastAccess,
      status: this.status,
      activeStatus: this.activeStatus,
      enrollType: this.enrollType,
      isUpdateOldProgress: this.isUpdateOldProgress,
    };
  }

  toFormData(): FormData {
    const fd = new FormData();

    if (this.userIDs && this.userIDs.length > 0) {
      this.userIDs.forEach((id) => fd.append('UserIDs', id));
    }

    fd.append('LessonID', this.lessonID);

    if (this.progress !== null && this.progress !== undefined) {
      fd.append('Progress', String(this.progress));
    }

    const startDateStr = DateTimeUtils.formatISODateToString(this.startDate);

    if (startDateStr) fd.append('StartDate', startDateStr);

    if (this.lastAccess) {
      fd.append('LastAccess', this.lastAccess);
    }

    fd.append('Status', this.status);
    fd.append('ActiveStatus', String(this.activeStatus));
    fd.append('EnrollType', String(this.enrollType));
    fd.append('IsUpdateOldProgress', String(this.isUpdateOldProgress));

    if (this.userFile) {
      fd.append('UserFile', this.userFile);
    }

    return fd;
  }
}
