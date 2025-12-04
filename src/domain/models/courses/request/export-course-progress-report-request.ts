export class ExportCourseProgressReportRequest {
  courseId!: string;

  statuses?: string[];
  departmentCodes?: string[];

  minProgress?: number;
  maxProgress?: number;

  actualStartDateFrom?: string;
  actualStartDateTo?: string;
  actualEndDateFrom?: string;
  actualEndDateTo?: string;

  lastAccessFrom?: string;
  lastAccessTo?: string;

  isOverdue?: boolean;
  hasStarted?: boolean;

  sortBy?: string;
  sortDescending: boolean = false;

  constructor(init?: Partial<ExportCourseProgressReportRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ExportCourseProgressReportRequest {
    return new ExportCourseProgressReportRequest({
      courseId: json.courseId,

      statuses: json.statuses ?? undefined,
      departmentCodes: json.departmentCodes ?? undefined,

      minProgress: json.minProgress,
      maxProgress: json.maxProgress,

      actualStartDateFrom: json.actualStartDateFrom,
      actualStartDateTo: json.actualStartDateTo,
      actualEndDateFrom: json.actualEndDateFrom,
      actualEndDateTo: json.actualEndDateTo,

      lastAccessFrom: json.lastAccessFrom,
      lastAccessTo: json.lastAccessTo,

      isOverdue: json.isOverdue,
      hasStarted: json.hasStarted,

      sortBy: json.sortBy,
      sortDescending: json.sortDescending ?? false,
    });
  }

  toJson(): any {
    return {
      courseId: this.courseId,

      statuses: this.statuses,
      departmentCodes: this.departmentCodes,

      minProgress: this.minProgress,
      maxProgress: this.maxProgress,

      actualStartDateFrom: this.actualStartDateFrom,
      actualStartDateTo: this.actualStartDateTo,
      actualEndDateFrom: this.actualEndDateFrom,
      actualEndDateTo: this.actualEndDateTo,

      lastAccessFrom: this.lastAccessFrom,
      lastAccessTo: this.lastAccessTo,

      isOverdue: this.isOverdue,
      hasStarted: this.hasStarted,

      sortBy: this.sortBy,
      sortDescending: this.sortDescending,
    };
  }
}
