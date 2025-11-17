import {
  CategoryEnum,
  DisplayTypeEnum,
  LearningModeEnum,
  ScheduleStatusEnum,
  StatusEnum,
} from '@/utils/enum/core-enum';

import { CreateLessonCollectionRequest } from './create-course-lesson-collection-request';

export class CreateCourseRequest {
  pathID?: string;
  detail?: string;
  isRequired?: boolean;
  name = '';

  disableStatus: StatusEnum = StatusEnum.Enable;
  positionStateCode?: string;
  isFixedCourse: boolean = false;
  teacherID?: string;

  courseType: LearningModeEnum = LearningModeEnum.Online;
  displayType: DisplayTypeEnum = DisplayTypeEnum.Public;

  meetingLink?: string;

  scheduleStatus: ScheduleStatusEnum = ScheduleStatusEnum.Ongoing;

  collections?: CreateLessonCollectionRequest[];

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

  toFormData(): FormData {
    const formData = new FormData();

    formData.append('Name', this.name);
    if (this.pathID) formData.append('PathID', this.pathID);
    if (this.detail) formData.append('Detail', this.detail);
    if (this.isRequired !== undefined) formData.append('IsRequired', this.isRequired.toString());
    formData.append('DisableStatus', this.disableStatus.toString());
    if (this.positionStateCode) formData.append('PositionStateCode', this.positionStateCode);
    formData.append('IsFixedCourse', this.isFixedCourse.toString());
    if (this.teacherID) formData.append('TeacherID', this.teacherID);
    formData.append('CourseType', this.courseType.toString());
    formData.append('DisplayType', this.displayType.toString());
    if (this.meetingLink) formData.append('MeetingLink', this.meetingLink);
    formData.append('ScheduleStatus', this.scheduleStatus.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID) formData.append('ThumbnailID', this.thumbnailID);
    if (this.resourceIDs) formData.append('ResourceIDs', this.resourceIDs);
    if (this.resources) this.resources.forEach((file) => formData.append('Resources', file));
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

    // Collections => append as JSON string
    if (this.collections && this.collections.length > 0) {
      formData.append(
        'Collections',
        JSON.stringify(
          this.collections.map((c) => ({
            Name: c.name,
            Order: c.order,
            StartDate: c.startDate ? c.startDate.toISOString() : undefined,
            EndDate: c.endDate ? c.endDate.toISOString() : undefined,
            FixedCourseDayDuration: c.fixedCourseDayDuration,
            LessonIds: c.lessonIds,
          }))
        )
      );
    }

    return formData;
  }
}
