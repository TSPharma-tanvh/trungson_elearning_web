export class UserPathProgressResponse {
  id?: string;
  userID?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status = '';

  static fromJson(json: any): UserPathProgressResponse {
    const dto = new UserPathProgressResponse();
    dto.id = json.id;
    dto.userID = json.userID;
    dto.pathID = json.pathID;
    dto.progress = json.progress;
    dto.startDate = json.startDate;
    dto.endDate = json.endDate;
    dto.lastAccess = json.lastAccess;
    dto.status = json.status;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      pathID: this.pathID,
      progress: this.progress,
      startDate: this.startDate,
      endDate: this.endDate,
      lastAccess: this.lastAccess,
      status: this.status,
    };
  }
}
