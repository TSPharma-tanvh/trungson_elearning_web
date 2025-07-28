import {
  DisplayTypeEnum,
  LearningModeEnum,
  ScheduleStatusEnum,
  StatusEnum,
  type CategoryEnum,
} from '@/utils/enum/core-enum';

export class CreateCourseRequest {
  pathID?: string;
  detail?: string;
  isRequired?: boolean;
  name = '';

  disableStatus: StatusEnum = StatusEnum.Enable;
  teacherID?: string;

  courseType: LearningModeEnum = LearningModeEnum.Online;
  displayType: DisplayTypeEnum = DisplayTypeEnum.Public;

  imageID?: string;
  startTime?: string;
  endTime?: string;
  meetingLink?: string;

  scheduleStatus: ScheduleStatusEnum = ScheduleStatusEnum.Schedule;
  lessonIds?: string;

  enrollmentCriteriaIDs?: string;
  categoryID?: string;

  thumbnailID?: string;
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;

  isDeleteOldResource?: boolean;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;

  constructor(init?: Partial<CreateCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateCourseRequest {
    return new CreateCourseRequest({
      pathID: json.pathID,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,
      teacherID: json.teacherID,
      courseType: json.courseType,
      displayType: json.displayType,
      imageID: json.imageID,
      startTime: json.startTime,
      endTime: json.endTime,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      lessonIds: json.lessonIds,
      enrollmentCriteriaIDs: json.enrollmentCriteriaIDs,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      resourceIDs: json.resourceIDs,
      resourceDocumentNo: json.resourceDocumentNo,
      resourcePrefixName: json.resourcePrefixName,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldResource: json.isDeleteOldResource,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
      categoryEnum: json.categoryEnum,
    });
  }

  toJSON(): any {
    return {
      pathID: this.pathID,
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,
      teacherID: this.teacherID,
      courseType: this.courseType,
      displayType: this.displayType,
      imageID: this.imageID,
      startTime: this.startTime,
      endTime: this.endTime,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      lessonIds: this.lessonIds,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldResource: this.isDeleteOldResource,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    formData.append('Name', this.name);
    if (this.pathID) formData.append('PathID', this.pathID);
    if (this.detail) formData.append('Detail', this.detail);
    if (this.isRequired !== undefined) formData.append('IsRequired', this.isRequired.toString());
    formData.append('DisableStatus', this.disableStatus.toString());
    if (this.teacherID) formData.append('TeacherID', this.teacherID);
    formData.append('CourseType', this.courseType.toString());
    formData.append('DisplayType', this.displayType.toString());
    if (this.imageID) formData.append('ImageID', this.imageID);
    if (this.startTime) formData.append('StartTime', this.startTime);
    if (this.endTime) formData.append('EndTime', this.endTime);
    if (this.meetingLink) formData.append('MeetingLink', this.meetingLink);
    formData.append('ScheduleStatus', this.scheduleStatus.toString());
    if (this.lessonIds) formData.append('LessonIds', this.lessonIds);
    if (this.enrollmentCriteriaIDs) formData.append('EnrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID) formData.append('ThumbnailID', this.thumbnailID);
    if (this.resourceIDs) formData.append('ResourceIDs', this.resourceIDs);
    if (this.resources) {
      this.resources.forEach((file) => {
        formData.append(`Resources`, file);
      });
    }
    if (this.resourceDocumentNo) formData.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) formData.append('ResourcePrefixName', this.resourcePrefixName);
    if (this.thumbnail) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldResource !== undefined)
      formData.append('IsDeleteOldResource', this.isDeleteOldResource.toString());
    if (this.isDeleteOldThumbnail !== undefined)
      formData.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());

    return formData;
  }
}
