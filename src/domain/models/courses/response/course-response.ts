import { LearningModeEnum, ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';

export class CourseResponse {
  id: string = '';
  pathId?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: StatusEnum;
  teacherId?: string;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  startTime?: string;
  endTime?: string;
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
    dto.startTime = json.startTime;
    dto.endTime = json.endTime;
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
      startTime: this.startTime,
      endTime: this.endTime,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
    };
  }
}
