import { DateTimeUtils } from '@/utils/date-time-utils';
import { StatusEnum, UserProgressEnum, UserQuizProgressEnum } from '@/utils/enum/core-enum';

export class UpdateUserQuizRequest {
  quizID!: string;
  userIDs!: string[];
  assignedAt?: Date;
  startAt?: Date;
  completedAt?: Date;
  progressStatus?: UserQuizProgressEnum;
  activeStatus?: StatusEnum;
  score?: number;
  attempts?: number;

  constructor(init?: Partial<UpdateUserQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateUserQuizRequest {
    const dto = new UpdateUserQuizRequest();
    dto.quizID = json.quizID;
    dto.userIDs = json.userIDs ?? [];
    dto.assignedAt = json.assignedAt ? new Date(json.assignedAt) : undefined;
    dto.startAt = json.startAt ? new Date(json.startAt) : undefined;
    dto.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
    dto.progressStatus = json.progressStatus;
    dto.activeStatus = json.activeStatus;
    dto.score = json.score;
    dto.attempts = json.attempts;
    return dto;
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      userIDs: this.userIDs,
      assignedAt: this.assignedAt != null ? DateTimeUtils.formatISODateToString(this.assignedAt) : null,
      startAt: this.startAt != null ? DateTimeUtils.formatISODateToString(this.startAt) : null,
      completedAt: this.completedAt != null ? DateTimeUtils.formatISODateToString(this.completedAt) : null,
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      score: this.score,
      attempts: this.attempts,
    };
  }

  toFormData(): FormData {
    const form = new FormData();
    form.append('quizID', this.quizID);
    this.userIDs.forEach((uid) => form.append('userIDs', uid));
    if (this.assignedAt != null) {
      form.append('assignedAt', DateTimeUtils.formatISODateToString(this.assignedAt));
    }
    if (this.startAt != null) {
      form.append('startAt', DateTimeUtils.formatISODateToString(this.startAt));
    }
    if (this.completedAt != null) {
      form.append('completedAt', DateTimeUtils.formatISODateToString(this.completedAt));
    }
    if (this.progressStatus != null) form.append('progressStatus', this.progressStatus.toString());
    if (this.activeStatus != null) form.append('activeStatus', this.activeStatus.toString());
    if (this.score != null) form.append('score', this.score.toString());
    if (this.attempts != null) form.append('attempts', this.attempts.toString());
    return form;
  }
}
