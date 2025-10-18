import { type LearningModeEnum, type ScheduleStatusEnum } from '@/utils/enum/core-enum';
import { type DisplayTypeEnum, type StatusEnum } from '@/utils/enum/path-enum';

export class GetCourseRequest {
  pathID?: string;
  name?: string;
  isRequired?: boolean;
  hasPath?: boolean;
  disableStatus?: StatusEnum;
  teacherID?: string;
  courseType?: LearningModeEnum;
  displayType?: DisplayTypeEnum;
  scheduleStatus?: ScheduleStatusEnum;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetCourseRequest {
    return new GetCourseRequest({
      pathID: json.pathID,
      name: json.name,
      isRequired: json.isRequired,
      hasPath: json.hasPath,
      disableStatus: json.disableStatus !== undefined ? (Number(json.disableStatus) as StatusEnum) : undefined,
      teacherID: json.teacherID,
      courseType: json.courseType !== undefined ? (Number(json.courseType) as LearningModeEnum) : undefined,
      displayType: json.displayType !== undefined ? (Number(json.displayType) as DisplayTypeEnum) : undefined,
      scheduleStatus:
        json.scheduleStatus !== undefined ? (Number(json.scheduleStatus) as ScheduleStatusEnum) : undefined,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      pathID: this.pathID,
      name: this.name,
      isRequired: this.isRequired,
      hasPath: this.hasPath,
      disableStatus: this.disableStatus !== undefined ? Number(this.disableStatus) : undefined,
      teacherID: this.teacherID,
      courseType: this.courseType !== undefined ? Number(this.courseType) : undefined,
      displayType: this.displayType !== undefined ? Number(this.displayType) : undefined,
      scheduleStatus: this.scheduleStatus !== undefined ? Number(this.scheduleStatus) : undefined,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }

  toQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};

    if (this.pathID) params['PathID'] = this.pathID;
    if (this.name) params['Name'] = this.name;
    if (this.isRequired !== undefined) params['IsRequired'] = this.isRequired.toString();
    if (this.hasPath !== undefined) params['HasPath'] = this.hasPath.toString();
    if (this.disableStatus !== undefined) params['DisableStatus'] = this.disableStatus.toString();
    if (this.teacherID) params['TeacherID'] = this.teacherID;
    if (this.courseType !== undefined) params['CourseType'] = this.courseType.toString();
    if (this.displayType !== undefined) params['DisplayType'] = this.displayType.toString();
    if (this.scheduleStatus !== undefined) params['ScheduleStatus'] = this.scheduleStatus.toString();
    if (this.searchText) params['SearchText'] = this.searchText;
    params['PageNumber'] = this.pageNumber.toString();
    params['PageSize'] = this.pageSize.toString();

    return params;
  }
}
