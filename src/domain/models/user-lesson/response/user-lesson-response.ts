export class UserLessonResponse {
  id?: string;
  userID?: string;
  lessonID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status: string = '';

  constructor(init?: Partial<UserLessonResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserLessonResponse {
    return new UserLessonResponse({
      id: json.id,
      userID: json.userID,
      lessonID: json.lessonID,
      progress: json.progress,
      startDate: json.startDate,
      endDate: json.endDate,
      lastAccess: json.lastAccess,
      status: json.status ?? '',
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      userID: this.userID,
      lessonID: this.lessonID,
      progress: this.progress,
      startDate: this.startDate,
      endDate: this.endDate,
      lastAccess: this.lastAccess,
      status: this.status,
    };
  }
}
