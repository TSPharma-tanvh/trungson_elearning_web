import { type StatusEnum, type UserQuizProgressEnum } from '@/utils/enum/core-enum';

import { QuizResponse } from '../../quiz/response/quiz-response';
import { UserAnswerResponse } from '../../user-answer/response/user-answer-response';

export class UserQuizProgressionResponse {
  id!: string;

  userID?: string;
  quizID?: string;
  progressStatus!: UserQuizProgressEnum;
  activeStatus!: StatusEnum;

  assignedAt!: Date;
  customStartTime?: Date;
  customEndTime?: Date;
  duration?: string;
  score?: number;
  attempts?: number;
  startedAt?: Date;
  completedAt?: Date;
  lastAccess?: Date;

  sessionID?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  deviceId?: string;
  deviceName?: string;
  os?: string;
  location?: string;

  quiz?: QuizResponse;
  userAnswers?: UserAnswerResponse[];

  constructor(init?: Partial<UserQuizProgressionResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserQuizProgressionResponse {
    const dto = new UserQuizProgressionResponse();
    dto.id = json.id!;
    dto.userID = json.userID;
    dto.quizID = json.quizID;
    dto.progressStatus = json.progressStatus;
    dto.activeStatus = json.activeStatus;
    dto.assignedAt = new Date(json.assignedAt);
    dto.customStartTime = json.customStartTime ? new Date(json.customStartTime) : undefined;
    dto.customEndTime = json.customEndTime ? new Date(json.customEndTime) : undefined;
    dto.duration = json.duration;
    dto.score = json.score;
    dto.attempts = json.attempts;
    dto.startedAt = json.startedAt ? new Date(json.startedAt) : undefined;
    dto.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.sessionID = json.sessionID;
    dto.ipAddress = json.ipAddress;
    dto.userAgent = json.userAgent;
    dto.deviceInfo = json.deviceInfo;
    dto.deviceId = json.deviceId;
    dto.deviceName = json.deviceName;
    dto.os = json.os;
    dto.location = json.location;
    dto.quiz = json.quiz ? QuizResponse.fromJSON(json.quiz) : undefined;
    dto.userAnswers = Array.isArray(json.userAnswers)
      ? json.userAnswers.map((a: any) => UserAnswerResponse.fromJSON(a))
      : undefined;
    return dto;
  }

  toJSON(): any {
    return {
      id: this.id,
      userID: this.userID,
      quizID: this.quizID,
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      assignedAt: this.assignedAt.toISOString(),
      customStartTime: this.customStartTime?.toISOString(),
      customEndTime: this.customEndTime?.toISOString(),
      duration: this.duration,
      score: this.score,
      attempts: this.attempts,
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      sessionID: this.sessionID,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      deviceInfo: this.deviceInfo,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      os: this.os,
      location: this.location,
      quiz: this.quiz?.toJSON?.(),
      userAnswers: this.userAnswers?.map((a) => a.toJSON?.()),
    };
  }
}
