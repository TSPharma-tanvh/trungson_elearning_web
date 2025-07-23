import { StatusEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';

import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { QuizResponse } from '../../quiz/response/quiz-response';
import { UserAnswerResponse } from '../../user-answer/response/user-answer-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class UserQuizProgressDetailResponse {
  id?: string;
  userId?: string;
  quizId?: string;
  progressStatus?: string;
  activeStatus?: string;
  assignedAt?: Date;
  customStartTime?: Date;
  customEndTime?: Date;
  duration?: string;
  score?: number;
  attempts?: number;
  startedAt?: Date;
  completedAt?: Date;
  lastAccess?: Date;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  deviceInfo?: string;
  deviceId?: string;
  deviceName?: string;
  os?: string;
  location?: string;
  enrollmentId?: string;
  quiz?: QuizResponse;
  user?: UserDetailResponse;
  userAnswers: UserAnswerResponse[] = [];
  enrollment?: EnrollmentResponse;

  constructor(init?: Partial<UserQuizProgressDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserQuizProgressDetailResponse {
    const dto = new UserQuizProgressDetailResponse();
    dto.id = json.id;
    dto.userId = json.userId;
    dto.quizId = json.quizId;
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
    dto.sessionId = json.sessionId;
    dto.ipAddress = json.ipAddress;
    dto.userAgent = json.userAgent;
    dto.deviceInfo = json.deviceInfo;
    dto.deviceId = json.deviceId;
    dto.deviceName = json.deviceName;
    dto.os = json.os;
    dto.location = json.location;
    dto.enrollmentId = json.enrollmentId;
    dto.quiz = json.quiz ? QuizResponse.fromJSON(json.quiz) : undefined;
    dto.user = json.user ? UserDetailResponse.fromJSON(json.user) : undefined;
    dto.userAnswers = json.userAnswers?.map((a: any) => UserAnswerResponse.fromJSON(a)) || [];
    dto.enrollment = json.enrollment ? EnrollmentResponse.fromJson(json.enrollment) : undefined;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userId: this.userId,
      quizId: this.quizId,
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      assignedAt: this.assignedAt?.toISOString(),
      customStartTime: this.customStartTime?.toISOString(),
      customEndTime: this.customEndTime?.toISOString(),
      duration: this.duration,
      score: this.score,
      attempts: this.attempts,
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      sessionId: this.sessionId,
      ipAddress: this.ipAddress,
      userAgent: this.userAgent,
      deviceInfo: this.deviceInfo,
      deviceId: this.deviceId,
      deviceName: this.deviceName,
      os: this.os,
      location: this.location,
      enrollmentId: this.enrollmentId,
      quiz: this.quiz?.toJSON(),
      user: this.user?.toJSON(),
      userAnswers: this.userAnswers?.map((x) => x.toJSON()),
      enrollment: this.enrollment?.toJson(),
    };
  }
}
