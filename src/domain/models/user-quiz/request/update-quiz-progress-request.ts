import { DateTimeUtils } from '@/utils/date-time-utils';
import { type StatusEnum, UserProgressEnum, type UserQuizProgressEnum } from '@/utils/enum/core-enum';

export class UpdateUserQuizRequest {
  userID!: string;
  quizID!: string;
  progressStatus?: UserQuizProgressEnum;
  activeStatus?: StatusEnum;
  deviceInfo?: string;
  deviceId?: string;
  deviceName?: string;
  assignedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  score?: number;
  attempts?: number;

  constructor(init?: Partial<UpdateUserQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateUserQuizRequest {
    const dto = new UpdateUserQuizRequest();
    dto.userID = json.userID;
    dto.quizID = json.quizID;
    dto.progressStatus = json.progressStatus;
    dto.activeStatus = json.activeStatus;
    dto.deviceInfo = json.deviceInfo;
    dto.deviceId = json.deviceId;
    dto.deviceName = json.deviceName;
    dto.assignedAt = json.assignedAt ? new Date(json.assignedAt) : undefined;
    dto.startedAt = json.startedAt ? new Date(json.startedAt) : undefined;
    dto.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
    dto.score = json.score;
    dto.attempts = json.attempts;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      quizID: this.quizID,
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      deviceInfo: this.deviceInfo,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      assignedAt: this.assignedAt?.toISOString(),
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      score: this.score,
      attempts: this.attempts,
    };
  }
}
