import { DateTimeUtils } from '@/utils/date-time-utils';
import { LessonTypeEnum } from '@/utils/enum/core-enum';

export class GetUserLessonProgressRequest {
  userID?: string;
  lessonID?: string;
  courseID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: string;
  searchText?: string;
  lessonType?: LessonTypeEnum;

  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserLessonProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserLessonProgressRequest {
    const dto = new GetUserLessonProgressRequest();
    dto.userID = json.userID;
    dto.lessonID = json.lessonID;
    dto.courseID = json.courseID;
    dto.progress = json.progress;
    dto.startDate = json.startDate ? new Date(json.startDate) : undefined;
    dto.endDate = json.endDate ? new Date(json.endDate) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.status = json.status;
    dto.searchText = json.searchText;
    dto.lessonType = json.lessonType;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      lessonID: this.lessonID,
      courseID: this.courseID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      lastAccess: DateTimeUtils.formatISODateToString(this.lastAccess),
      status: this.status,
      searchText: this.searchText,
      lessonType: this.lessonType,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
