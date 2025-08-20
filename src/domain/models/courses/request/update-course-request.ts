import {
  type CategoryEnum,
  type DisplayTypeEnum,
  type LearningModeEnum,
  type ScheduleStatusEnum,
  type StatusEnum,
} from '@/utils/enum/core-enum';

export class UpdateCourseRequest {
  id = '';
  pathID?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: StatusEnum;
  teacherID?: string;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  meetingLink?: string;
  scheduleStatus?: ScheduleStatusEnum;
  lessonIds?: string;
  categoryID?: string;
  thumbnailID?: string;
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  resourcesDeleteIds?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;
  enrollmentCriteriaIDs?: string;
  enrollmentCourseIDs?: string;
  maxCapacity?: number;
  enrollmentStatus?: StatusEnum;
  enrollmentCriteriaType?: CategoryEnum;

  constructor(init: Partial<UpdateCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UpdateCourseRequest {
    return new UpdateCourseRequest({
      id: json.id,
      pathID: json.pathID,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,
      teacherID: json.teacherID,
      courseType: json.courseType,
      displayType: json.displayType,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      enrollmentCriteriaIDs: json.enrollmentCriteriaIDs,
      enrollmentCourseIDs: json.enrollmentCourseIDs,
      maxCapacity: json.maxCapacity,
      enrollmentStatus: json.enrollmentStatus,
      enrollmentCriteriaType: json.enrollmentCriteriaType,
      lessonIds: json.lessonIds,
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
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      pathID: this.pathID,
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,
      teacherID: this.teacherID,
      courseType: this.courseType,
      displayType: this.displayType,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
      enrollmentCourseIDs: this.enrollmentCourseIDs,
      maxCapacity: this.maxCapacity,
      enrollmentStatus: this.enrollmentStatus,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      lessonIds: this.lessonIds,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      resourcesDeleteIds: this.resourcesDeleteIds,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('Id', this.id);
    if (this.pathID) formData.append('PathID', this.pathID);
    if (this.detail) formData.append('Detail', this.detail);
    if (this.isRequired !== undefined) formData.append('IsRequired', this.isRequired.toString());
    if (this.name) formData.append('Name', this.name);
    if (this.disableStatus !== undefined) formData.append('DisableStatus', this.disableStatus.toString());
    if (this.teacherID) formData.append('TeacherID', this.teacherID);
    if (this.courseType !== undefined) formData.append('CourseType', this.courseType.toString());
    if (this.displayType !== undefined) formData.append('DisplayType', this.displayType.toString());
    if (this.meetingLink) formData.append('MeetingLink', this.meetingLink);
    if (this.scheduleStatus !== undefined) formData.append('ScheduleStatus', this.scheduleStatus.toString());
    if (this.enrollmentCriteriaIDs) formData.append('EnrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
    if (this.enrollmentCourseIDs) formData.append('EnrollmentCourseIDs', this.enrollmentCourseIDs);
    if (this.maxCapacity !== undefined) formData.append('MaxCapacity', this.maxCapacity.toString());
    if (this.enrollmentStatus !== undefined) formData.append('EnrollmentStatus', this.enrollmentStatus.toString());
    if (this.enrollmentCriteriaType !== undefined)
      formData.append('EnrollmentCriteriaType', this.enrollmentCriteriaType.toString());
    if (this.lessonIds) formData.append('LessonIds', this.lessonIds);
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID) formData.append('ThumbnailID', this.thumbnailID);
    if (this.resourceIDs) formData.append('ResourceIDs', this.resourceIDs);
    if (this.resources) {
      this.resources.forEach((file) => {
        formData.append('Resources', file);
      });
    }
    if (this.resourceDocumentNo) formData.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) formData.append('ResourcePrefixName', this.resourcePrefixName);
    if (this.thumbnail) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.resourcesDeleteIds) formData.append('ResourcesDeleteIds', this.resourcesDeleteIds);
    if (this.isDeleteOldThumbnail !== undefined)
      formData.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());

    return formData;
  }
}
