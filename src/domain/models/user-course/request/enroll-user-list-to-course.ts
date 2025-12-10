import { DateTimeUtils } from '@/utils/date-time-utils';
import { StatusEnum, type ProgressEnrollmentTypeEnum, type UserProgressEnum } from '@/utils/enum/core-enum';

export class EnrollUserListToCourseRequest {
  userIDs: string[] = [];
  userFile?: File;

  enrollType!: ProgressEnrollmentTypeEnum; // required
  courseID!: string; // required
  progress?: number;

  fixedCourseStartDate!: Date; // required

  isUpdateOldProgress = false; // required, default false

  lastAccess?: Date;

  status!: UserProgressEnum; // required
  activeStatus: StatusEnum = StatusEnum.Enable; // required, default Enable

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
      fixedCourseStartDate: json.FixedCourseStartDate ? new Date(json.FixedCourseStartDate) : undefined,
      isUpdateOldProgress: json.isUpdateOldProgress ?? false,
      lastAccess: json.lastAccess ? new Date(json.lastAccess) : undefined,
      status: json.status,
      activeStatus: json.activeStatus ?? StatusEnum.Enable,
    });
  }

  toJson(): any {
    return {
      userIDs: this.userIDs,
      enrollType: this.enrollType,
      courseID: this.courseID,
      progress: this.progress,
      fixedCourseStartDate: DateTimeUtils.formatISODateToString(this.fixedCourseStartDate),
      isUpdateOldProgress: this.isUpdateOldProgress,
      lastAccess: DateTimeUtils.formatISODateToString(this.lastAccess),
      status: this.status,
      activeStatus: this.activeStatus,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    if (this.userIDs?.length) {
      this.userIDs.forEach((id, i) => {
        formData.append(`UserIDs[${i}]`, id);
      });
    }

    formData.append('EnrollType', this.enrollType.toString());
    formData.append('CourseID', this.courseID);

    const startDateStr = DateTimeUtils.formatISODateToString(this.fixedCourseStartDate);
    if (startDateStr) formData.append('FixedCourseStartDate', startDateStr);

    formData.append('IsUpdateOldProgress', this.isUpdateOldProgress.toString());
    formData.append('Status', this.status.toString());
    formData.append('ActiveStatus', this.activeStatus.toString());

    if (this.progress !== undefined) formData.append('Progress', this.progress.toString());

    const startDate = DateTimeUtils.formatISODateToString(this.fixedCourseStartDate);
    if (startDate) {
      formData.append('FixedCourseStartDate', startDate);
    }

    if (this.userFile) formData.append('UserFile', this.userFile);

    return formData;
  }
}
