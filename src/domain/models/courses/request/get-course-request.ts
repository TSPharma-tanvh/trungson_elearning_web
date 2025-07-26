import { type LearningModeEnum, type ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { type DisplayTypeEnum, type StatusEnum } from '@/utils/enum/path-enum';

export class GetCourseRequest {
  pathID?: string;
  name?: string;
  isRequired?: boolean;
  disableStatus?: StatusEnum;
  teacherID?: string;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  startTimeFrom?: Date;
  startTimeTo?: Date;
  endTimeFrom?: Date;
  endTimeTo?: Date;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetCourseRequest {
    return new GetCourseRequest({
      pathID: json.pathID,
      name: json.name,
      isRequired: json.isRequired,
      disableStatus: json.disableStatus != null ? (Number(json.disableStatus) as StatusEnum) : undefined,
      teacherID: json.teacherID,
      courseType: json.courseType != null ? (Number(json.courseType) as LearningModeEnum) : undefined,
      displayType: json.displayType != null ? (Number(json.displayType) as DisplayTypeEnum) : undefined,
      scheduleStatus: json.scheduleStatus != null ? (Number(json.scheduleStatus) as ScheduleStatusEnum) : undefined,
      startTimeFrom: json.startTimeFrom ? new Date(json.startTimeFrom) : undefined,
      startTimeTo: json.startTimeTo ? new Date(json.startTimeTo) : undefined,
      endTimeFrom: json.endTimeFrom ? new Date(json.endTimeFrom) : undefined,
      endTimeTo: json.endTimeTo ? new Date(json.endTimeTo) : undefined,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      pathID: this.pathID,
      name: this.name,
      isRequired: this.isRequired,
      disableStatus: this.disableStatus != null ? Number(this.disableStatus) : undefined,
      teacherID: this.teacherID,
      courseType: this.courseType != null ? Number(this.courseType) : undefined,
      displayType: this.displayType != null ? Number(this.displayType) : undefined,
      scheduleStatus: this.scheduleStatus != null ? Number(this.scheduleStatus) : undefined,
      startTimeFrom: this.startTimeFrom?.toISOString(),
      startTimeTo: this.startTimeTo?.toISOString(),
      endTimeFrom: this.endTimeFrom?.toISOString(),
      endTimeTo: this.endTimeTo?.toISOString(),
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
