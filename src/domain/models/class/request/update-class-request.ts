import { DateTimeUtils } from '@/utils/date-time-utils';
import { type CategoryEnum, type LearningModeEnum, type ScheduleStatusEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateClassRequest {
  id!: string;
  className?: string;
  classDetail?: string;
  duration?: string;
  locationID?: string;
  teacherID?: string;
  qrCodeURL?: string;
  startAt?: Date;
  endAt?: Date;
  minuteLate?: number;
  enrollmentCriteriaIDs?: string;
  classType?: LearningModeEnum;
  meetingLink?: string;
  scheduleStatus?: ScheduleStatusEnum;
  categoryID?: string;
  thumbnailID?: string;
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;
  enrollmentCriteriaType?: CategoryEnum;
  enrollmentStatus?: StatusEnum;
  maxCapacity?: number;
  enrollmentCourseIDs?: string;

  constructor(init?: Partial<UpdateClassRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateClassRequest {
    const dto = new UpdateClassRequest();
    Object.assign(dto, {
      id: json.id,
      className: json.className,
      classDetail: json.classDetail,
      duration: json.duration,
      locationID: json.locationID,
      teacherID: json.teacherID,
      qrCodeURL: json.qrCodeURL,
      startAt: json.startAt ? DateTimeUtils.parseLocalDateTimeString(json.startAt) : undefined,
      endAt: json.endAt ? DateTimeUtils.parseLocalDateTimeString(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      enrollmentCriteriaIDs: json.enrollmentCriteriaIDs,
      classType: json.classType,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      resourceIDs: json.resourceIDs,
      resourceDocumentNo: json.resourceDocumentNo,
      resourcePrefixName: json.resourcePrefixName,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      resourcesDeleteIds: json.resourcesDeleteIds,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
      categoryEnum: json.categoryEnum,
      enrollmentCriteriaType: json.enrollmentCriteriaType,
      enrollmentStatus: json.enrollmentStatus,
      maxCapacity: json.maxCapacity,
      enrollmentCourseIDs: json.enrollmentCourseIDs,
    });
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      className: this.className,
      classDetail: this.classDetail,
      duration: this.duration,
      locationID: this.locationID,
      teacherID: this.teacherID,
      qrCodeURL: this.qrCodeURL,
      startAt: DateTimeUtils.formatISODateToString(this.startAt),
      endAt: DateTimeUtils.formatISODateToString(this.endAt),
      minuteLate: this.minuteLate,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
      classType: this.classType,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      enrollmentStatus: this.enrollmentStatus,
      maxCapacity: this.maxCapacity,
      enrollmentCourseIDs: this.enrollmentCourseIDs,
    };
  }

  toFormData(): FormData {
    const fd = new FormData();
    fd.append('Id', this.id);

    const appendIfExist = (key: string, val: any) => {
      if (val != null) fd.append(key, typeof val === 'string' ? val : String(val));
    };

    appendIfExist('ClassName', this.className);
    appendIfExist('ClassDetail', this.classDetail);
    appendIfExist('Duration', this.duration);
    appendIfExist('LocationID', this.locationID);
    appendIfExist('TeacherID', this.teacherID);
    appendIfExist('QRCodeURL', this.qrCodeURL);
    if (this.startAt) appendIfExist('StartAt', DateTimeUtils.formatISODateToString(this.startAt));
    if (this.endAt) appendIfExist('EndAt', DateTimeUtils.formatISODateToString(this.endAt));
    appendIfExist('MinuteLate', this.minuteLate);
    appendIfExist('EnrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
    appendIfExist('ClassType', this.classType);
    appendIfExist('MeetingLink', this.meetingLink);
    appendIfExist('ScheduleStatus', this.scheduleStatus);
    appendIfExist('CategoryID', this.categoryID);
    appendIfExist('ThumbnailID', this.thumbnailID);
    appendIfExist('ResourceIDs', this.resourceIDs);
    appendIfExist('ResourceDocumentNo', this.resourceDocumentNo);
    appendIfExist('ResourcePrefixName', this.resourcePrefixName);
    appendIfExist('ThumbDocumentNo', this.thumbDocumentNo);
    appendIfExist('ThumbPrefixName', this.thumbPrefixName);
    appendIfExist('IsDeleteOldThumbnail', this.isDeleteOldThumbnail);
    appendIfExist('CategoryEnum', this.categoryEnum);
    appendIfExist('EnrollmentCriteriaType', this.enrollmentCriteriaType);
    appendIfExist('EnrollmentStatus', this.enrollmentStatus);
    appendIfExist('MaxCapacity', this.maxCapacity);
    appendIfExist('EnrollmentCourseIDs', this.enrollmentCourseIDs);
    if (this.thumbnail) fd.append('Thumbnail', this.thumbnail);
    if (this.resources) {
      this.resources.forEach((f) => { fd.append('Resources', f, f.name); });
    }

    return fd;
  }
}
