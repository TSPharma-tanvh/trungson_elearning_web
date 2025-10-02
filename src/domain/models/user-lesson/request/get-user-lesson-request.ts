export class GetUserLessonProgressRequest {
  userID?: string;
  lessonID?: string;
  courseID?: string;
  progress?: number;
  startDate?: Date;
  endDate?: Date;
  lastAccess?: Date;
  status!: string;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserLessonProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserLessonProgressRequest {
    const dto = new GetUserLessonProgressRequest();
    dto.userID = json.userID;
    dto.lessonID = json.lessonID;
    dto.courseID = json.courseID;
    dto.progress = json.progress;
    dto.startDate = json.startDate ? new Date(json.startDate) : undefined;
    dto.endDate = json.endDate ? new Date(json.endDate) : undefined;
    dto.lastAccess = json.lastAccess ? new Date(json.lastAccess) : undefined;
    dto.status = json.status;
    dto.searchText = json.searchText;
    dto.pageNumber = json.pageNumber ?? 1;
    dto.pageSize = json.pageSize ?? 10;
    return dto;
  }

  toJson(): any {
    return {
      userID: this.userID,
      lessonID: this.lessonID,
      courseID: this.courseID,
      progress: this.progress,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      lastAccess: this.lastAccess?.toISOString(),
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
