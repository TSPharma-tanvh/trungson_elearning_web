export class ExportLessonProgressReportRequest {
  lessonId!: string;
  statuses?: string[];
  departmentCodes?: string[];
  minProgress?: number;
  maxProgress?: number;
  hasStarted?: boolean;
  hasViewedContent?: boolean;
  isOverdue?: boolean;
  startedFrom?: Date;
  startedTo?: Date;
  completedFrom?: Date;
  completedTo?: Date;
  lastAccessFrom?: Date;
  lastAccessTo?: Date;
  sortBy?: string;
  sortDescending = false;

  constructor(init?: Partial<ExportLessonProgressReportRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ExportLessonProgressReportRequest {
    return new ExportLessonProgressReportRequest({
      lessonId: json.lessonId,
      statuses: json.statuses,
      departmentCodes: json.departmentCodes,
      minProgress: json.minProgress,
      maxProgress: json.maxProgress,
      hasStarted: json.hasStarted,
      hasViewedContent: json.hasViewedContent,
      isOverdue: json.isOverdue,
      startedFrom: json.startedFrom ? new Date(json.startedFrom) : undefined,
      startedTo: json.startedTo ? new Date(json.startedTo) : undefined,
      completedFrom: json.completedFrom ? new Date(json.completedFrom) : undefined,
      completedTo: json.completedTo ? new Date(json.completedTo) : undefined,
      lastAccessFrom: json.lastAccessFrom ? new Date(json.lastAccessFrom) : undefined,
      lastAccessTo: json.lastAccessTo ? new Date(json.lastAccessTo) : undefined,
      sortBy: json.sortBy,
      sortDescending: json.sortDescending ?? false,
    });
  }

  toJson(): any {
    return {
      lessonId: this.lessonId,
      statuses: this.statuses,
      departmentCodes: this.departmentCodes,
      minProgress: this.minProgress,
      maxProgress: this.maxProgress,
      hasStarted: this.hasStarted,
      hasViewedContent: this.hasViewedContent,
      isOverdue: this.isOverdue,
      startedFrom: this.startedFrom?.toISOString(),
      startedTo: this.startedTo?.toISOString(),
      completedFrom: this.completedFrom?.toISOString(),
      completedTo: this.completedTo?.toISOString(),
      lastAccessFrom: this.lastAccessFrom?.toISOString(),
      lastAccessTo: this.lastAccessTo?.toISOString(),
      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
    };
  }

  toQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};

    params['LessonId'] = this.lessonId;

    if (this.statuses) params['Statuses'] = this.statuses.join(',');
    if (this.departmentCodes) params['DepartmentCodes'] = this.departmentCodes.join(',');
    if (this.minProgress !== undefined) params['MinProgress'] = this.minProgress.toString();
    if (this.maxProgress !== undefined) params['MaxProgress'] = this.maxProgress.toString();
    if (this.hasStarted !== undefined) params['HasStarted'] = this.hasStarted.toString();
    if (this.hasViewedContent !== undefined) params['HasViewedContent'] = this.hasViewedContent.toString();
    if (this.isOverdue !== undefined) params['IsOverdue'] = this.isOverdue.toString();

    if (this.startedFrom) params['StartedFrom'] = this.startedFrom.toISOString();
    if (this.startedTo) params['StartedTo'] = this.startedTo.toISOString();
    if (this.completedFrom) params['CompletedFrom'] = this.completedFrom.toISOString();
    if (this.completedTo) params['CompletedTo'] = this.completedTo.toISOString();
    if (this.lastAccessFrom) params['LastAccessFrom'] = this.lastAccessFrom.toISOString();
    if (this.lastAccessTo) params['LastAccessTo'] = this.lastAccessTo.toISOString();

    if (this.sortBy) params['SortBy'] = this.sortBy;
    params['SortDescending'] = this.sortDescending.toString();

    return params;
  }
}
