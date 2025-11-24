import { type StatusEnum, type UserQuizProgressEnum } from '@/utils/enum/core-enum';

export class GetUserQuizProgressRequest {
  quizId?: string;
  enrollmentCriteriaId?: string;
  assignedAt?: Date;
  startTime?: Date;
  endTime?: Date;
  duration?: string; // TimeSpan sẽ convert sang string
  startedAt?: Date;
  completedAt?: Date;
  lastAccess?: Date;
  progressStatus?: UserQuizProgressEnum;
  activeStatus?: StatusEnum;
  searchText?: string;
  quizType?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserQuizProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserQuizProgressRequest {
    const dto = new GetUserQuizProgressRequest();
    dto.quizId = json.quizId;
    dto.enrollmentCriteriaId = json.enrollmentCriteriaId;
    dto.assignedAt = json.assignedAt ? new Date(json.assignedAt) : undefined;
    dto.startTime = json.startTime ? new Date(json.startTime) : undefined;
    dto.endTime = json.endTime ? new Date(json.endTime) : undefined;
    dto.duration = json.duration;
    dto.startedAt = json.startedAt ? new Date(json.startedAt) : undefined;
    dto.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.progressStatus = json.progressStatus;
    dto.activeStatus = json.activeStatus;
    dto.searchText = json.searchText;
    dto.quizType = json.quizType;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJson(): any {
    return {
      quizId: this.quizId,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      assignedAt: this.assignedAt?.toISOString(),
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      duration: this.duration,
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      searchText: this.searchText,
      quizType: this.quizType,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }

  toFormData(): FormData {
    const form = new FormData();
    if (this.quizId) form.append('quizId', this.quizId);
    if (this.enrollmentCriteriaId) form.append('enrollmentCriteriaId', this.enrollmentCriteriaId);
    if (this.assignedAt) form.append('assignedAt', this.assignedAt.toISOString());
    if (this.startTime) form.append('startTime', this.startTime.toISOString());
    if (this.endTime) form.append('endTime', this.endTime.toISOString());
    if (this.duration) form.append('duration', this.duration);
    if (this.startedAt) form.append('startedAt', this.startedAt.toISOString());
    if (this.completedAt) form.append('completedAt', this.completedAt.toISOString());
    if (this.lastAccess) form.append('lastAccess', this.lastAccess.toISOString());
    if (this.progressStatus !== undefined) form.append('progressStatus', this.progressStatus.toString());
    if (this.activeStatus !== undefined) form.append('activeStatus', this.activeStatus.toString());
    if (this.searchText) form.append('searchText', this.searchText);
    if (this.quizType) form.append('quizType', this.quizType);
    form.append('pageNumber', this.pageNumber.toString());
    form.append('pageSize', this.pageSize.toString());
    return form;
  }
}
