export class ExportQuizProgressReportRequest {
  quizId!: string;
  statuses?: string[];
  departmentCodes?: string[];
  minScore?: number;
  maxScore?: number;
  hasStarted?: boolean;
  isOverdue?: boolean;
  startedFrom?: Date;
  startedTo?: Date;
  completedFrom?: Date;
  completedTo?: Date;
  lastAccessFrom?: Date;
  lastAccessTo?: Date;
  sortBy?: string;
  sortDescending: boolean = false;

  constructor(init?: Partial<ExportQuizProgressReportRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ExportQuizProgressReportRequest {
    if (!json) return new ExportQuizProgressReportRequest();

    return new ExportQuizProgressReportRequest({
      quizId: json.quizId,
      statuses: json.statuses,
      departmentCodes: json.departmentCodes,
      minScore: json.minScore,
      maxScore: json.maxScore,
      hasStarted: json.hasStarted,
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
      quizId: this.quizId,
      statuses: this.statuses,
      departmentCodes: this.departmentCodes,
      minScore: this.minScore,
      maxScore: this.maxScore,
      hasStarted: this.hasStarted,
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
}
