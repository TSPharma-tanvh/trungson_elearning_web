import { UserProgressEnum } from '@/utils/enum/core-enum';

export class CreateUserLessonRequest {
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: UserProgressEnum;

  constructor(init?: Partial<CreateUserLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateUserLessonRequest {
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

  toJSON(): any {
    return {
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
    };
  }
}
