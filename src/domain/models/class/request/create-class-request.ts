export class CreateClassRequest {
  className!: string;
  classDetail?: string;
  duration!: string; // TimeSpan in .NET = string in format HH:mm:ss
  locationID?: string;
  teacherID?: string;
  qrCodeURL?: string;
  startAt!: Date;
  endAt!: Date;
  minuteLate = 10;
  enrollmentCriteriaIDs?: string;
  classType = 0;
  meetingLink?: string;
  scheduleStatus = 0;
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
  categoryEnum?: number;
  enrollmentCriteriaType?: number;
  enrollmentStatus?: number;
  maxCapacity?: number;
  enrollmentCourseIDs?: string;

  constructor(init?: Partial<CreateClassRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateClassRequest {
    const dto = new CreateClassRequest();
    Object.assign(dto, {
      className: json.className,
      classDetail: json.classDetail,
      duration: json.duration,
      locationID: json.locationID,
      teacherID: json.teacherID,
      qrCodeURL: json.qrCodeURL,
      startAt: new Date(json.startAt),
      endAt: new Date(json.endAt),
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
      className: this.className,
      classDetail: this.classDetail,
      duration: this.duration,
      locationID: this.locationID,
      teacherID: this.teacherID,
      qrCodeURL: this.qrCodeURL,
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
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
    fd.append('ClassName', this.className);
    fd.append('Duration', this.duration);
    fd.append('StartAt', this.startAt.toISOString());
    fd.append('EndAt', this.endAt.toISOString());
    fd.append('MinuteLate', String(this.minuteLate));
    fd.append('ClassType', String(this.classType));
    fd.append('ScheduleStatus', String(this.scheduleStatus));

    if (this.classDetail) fd.append('ClassDetail', this.classDetail);
    if (this.locationID) fd.append('LocationID', this.locationID);
    if (this.teacherID) fd.append('TeacherID', this.teacherID);
    if (this.qrCodeURL) fd.append('QRCodeURL', this.qrCodeURL);
    if (this.enrollmentCriteriaIDs) fd.append('EnrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
    if (this.meetingLink) fd.append('MeetingLink', this.meetingLink);
    if (this.categoryID) fd.append('CategoryID', this.categoryID);
    if (this.thumbnailID) fd.append('ThumbnailID', this.thumbnailID);
    if (this.resourceIDs) fd.append('ResourceIDs', this.resourceIDs);
    if (this.resourceDocumentNo) fd.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) fd.append('ResourcePrefixName', this.resourcePrefixName);
    if (this.thumbDocumentNo) fd.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) fd.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail != null) fd.append('IsDeleteOldThumbnail', String(this.isDeleteOldThumbnail));
    if (this.categoryEnum != null) fd.append('CategoryEnum', String(this.categoryEnum));
    if (this.enrollmentCriteriaType != null) fd.append('EnrollmentCriteriaType', String(this.enrollmentCriteriaType));
    if (this.enrollmentStatus != null) fd.append('EnrollmentStatus', String(this.enrollmentStatus));
    if (this.maxCapacity != null) fd.append('MaxCapacity', String(this.maxCapacity));
    if (this.enrollmentCourseIDs) fd.append('EnrollmentCourseIDs', this.enrollmentCourseIDs);
    if (this.thumbnail) fd.append('Thumbnail', this.thumbnail);
    if (this.resources) {
      this.resources.forEach((r) => { fd.append('Resources', r, r.name); });
    }

    return fd;
  }
}
