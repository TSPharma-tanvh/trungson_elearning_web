import { type StatusEnum, type UserQuizProgressEnum } from '@/utils/enum/core-enum';

export class GetUserQuizProgressRequest {
  assignedAt?: Date;
  customStartTime?: Date;
  customEndTime?: Date;
  duration?: string;
  startedAt?: Date;
  completedAt?: Date;
  lastAccess?: Date;
  progressStatus?: UserQuizProgressEnum;
  activeStatus?: StatusEnum;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserQuizProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserQuizProgressRequest {
    const dto = new GetUserQuizProgressRequest();
    dto.assignedAt = json.assignedAt ? new Date(json.assignedAt) : undefined;
    dto.customStartTime = json.customStartTime ? new Date(json.customStartTime) : undefined;
    dto.customEndTime = json.customEndTime ? new Date(json.customEndTime) : undefined;
    dto.duration = json.duration;
    dto.startedAt = json.startedAt ? new Date(json.startedAt) : undefined;
    dto.completedAt = json.completedAt ? new Date(json.completedAt) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.progressStatus = json.progressStatus;
    dto.activeStatus = json.activeStatus;
    dto.searchText = json.searchText;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJson(): any {
    return {
      assignedAt: this.assignedAt?.toISOString(),
      customStartTime: this.customStartTime?.toISOString(),
      customEndTime: this.customEndTime?.toISOString(),
      duration: this.duration,
      startedAt: this.startedAt?.toISOString(),
      completedAt: this.completedAt?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      progressStatus: this.progressStatus,
      activeStatus: this.activeStatus,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }

  toFormData(): FormData {
    const form = new FormData();
    if (this.assignedAt) form.append('assignedAt', this.assignedAt.toISOString());
    if (this.customStartTime) form.append('customStartTime', this.customStartTime.toISOString());
    if (this.customEndTime) form.append('customEndTime', this.customEndTime.toISOString());
    if (this.duration) form.append('duration', this.duration);
    if (this.startedAt) form.append('startedAt', this.startedAt.toISOString());
    if (this.completedAt) form.append('completedAt', this.completedAt.toISOString());
    if (this.lastAccess) form.append('lastAccess', this.lastAccess.toISOString());
    if (this.progressStatus !== undefined) form.append('progressStatus', this.progressStatus.toString());
    if (this.activeStatus !== undefined) form.append('activeStatus', this.activeStatus.toString());
    if (this.searchText) form.append('searchText', this.searchText);
    form.append('pageNumber', this.pageNumber.toString());
    form.append('pageSize', this.pageSize.toString());
    return form;
  }
}
