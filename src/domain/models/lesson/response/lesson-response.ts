export class LessonResponse {
  id?: string;
  courseID?: string;
  name: string = '';
  detail?: string;
  enablePlay: boolean = false;
  status: string = '';
  lessonType: string = '';
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  videoID?: string;

  constructor(init?: Partial<LessonResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): LessonResponse {
    return new LessonResponse({
      id: json.id,
      courseID: json.courseID,
      name: json.name ?? '',
      detail: json.detail,
      enablePlay: json.enablePlay ?? false,
      status: json.status ?? '',
      lessonType: json.lessonType ?? '',
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      videoID: json.videoID,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      detail: this.detail,
      enablePlay: this.enablePlay,
      status: this.status,
      lessonType: this.lessonType,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      videoID: this.videoID,
    };
  }
}
