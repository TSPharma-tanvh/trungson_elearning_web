import { DateTimeUtils } from '@/utils/date-time-utils';

export class UpdateUserLessonRequest {
  id!: string;
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status?: string;

  constructor(init?: Partial<UpdateUserLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateUserLessonRequest {
    const dto = new UpdateUserLessonRequest();
    dto.id = json.id;
    dto.userID = json.userID;
    dto.lessonID = json.lessonID;
    dto.progress = json.progress;
    dto.startDate = json.startDate ? new Date(json.startDate) : undefined;
    dto.endDate = json.endDate ? new Date(json.endDate) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.status = json.status ? json.status : undefined;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: this.startDate ? DateTimeUtils.formatISODateToString(this.startDate) : undefined,
      endDate: this.endDate ? DateTimeUtils.formatISODateToString(this.endDate) : undefined,
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
    };
  }
}
