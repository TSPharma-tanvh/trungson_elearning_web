import { type LearningModeEnum, type ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { type DisplayTypeEnum, type StatusEnum } from '@/utils/enum/path-enum';

export class CourseResponse {
  id = '';
  pathId?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: StatusEnum;
  teacherId?: string;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  meetingLink?: string;
  scheduleStatus?: ScheduleStatusEnum;
  enrollmentCriteriaId?: string;
  categoryId?: string;
  thumbnailId?: string;

  static fromJson(json: any): CourseResponse {
    const dto = new CourseResponse();
    dto.id = json.id;
    dto.pathId = json.pathId;
    dto.detail = json.detail;
    dto.isRequired = json.isRequired;
    dto.name = json.name;
    dto.disableStatus = json.disableStatus;
    dto.teacherId = json.teacherId;
    dto.courseType = json.courseType;
    dto.displayType = json.displayType;
    dto.meetingLink = json.meetingLink;
    dto.scheduleStatus = json.scheduleStatus;
    dto.enrollmentCriteriaId = json.enrollmentCriteriaId;
    dto.categoryId = json.categoryId;
    dto.thumbnailId = json.thumbnailId;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      pathId: this.pathId,
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,
      teacherId: this.teacherId,
      courseType: this.courseType,
      displayType: this.displayType,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
    };
  }
}
