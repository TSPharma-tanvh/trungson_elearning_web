export class QuizLessonResponse {
  id?: string;
  courseID?: string;
  name?: string;
  title?: string;
  detail?: string;
  enablePlay?: boolean;
  isRequired?: boolean;
  status!: string;
  lessonType!: string;
  contentType?: string;
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  videoID?: string;

  constructor(init?: Partial<QuizLessonResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuizLessonResponse {
    return new QuizLessonResponse({
      id: json.id,
      courseID: json.courseID,
      name: json.name,
      title: json.title,
      detail: json.detail,
      enablePlay: json.enablePlay,
      isRequired: json.isRequired,
      status: json.status,
      lessonType: json.lessonType,
      contentType: json.contentType,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      videoID: json.videoID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      title: this.title,
      detail: this.detail,
      enablePlay: this.enablePlay,
      isRequired: this.isRequired,
      status: this.status,
      lessonType: this.lessonType,
      contentType: this.contentType,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      videoID: this.videoID,
    };
  }
}
