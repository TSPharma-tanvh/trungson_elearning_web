import { DateTimeUtils } from '@/utils/date-time-utils';

export class CreateUserLessonRequest {
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: string;

  constructor(init?: Partial<CreateUserLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateUserLessonRequest {
    const dto = new CreateUserLessonRequest();
    dto.userID = json.userID;
    dto.lessonID = json.lessonID;
    dto.progress = json.progress;
    dto.startDate = json.startDate ? new Date(json.startDate) : undefined;
    dto.endDate = json.endDate ? new Date(json.endDate) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.status = json.status;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: DateTimeUtils.formatISODateToString(this.startDate),
      endDate: DateTimeUtils.formatISODateToString(this.endDate),
      lastAccess: DateTimeUtils.formatISODateToString(this.lastAccess),
      status: this.status,
    };
  }
}
