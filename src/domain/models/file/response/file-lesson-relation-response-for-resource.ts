import { LessonDetailResponse } from '../../lessons/response/lesson-detail-response';

export class FileLessonRelationResponseForResource {
  lessonId?: string;
  fileResourceId?: string;
  lesson?: LessonDetailResponse;

  constructor(init?: Partial<FileLessonRelationResponseForResource>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileLessonRelationResponseForResource {
    if (!json) return new FileLessonRelationResponseForResource();
    return new FileLessonRelationResponseForResource({
      lessonId: json.lessonId,
      fileResourceId: json.fileResourceId,
      lesson: json.lesson ? LessonDetailResponse.fromJson(json.lesson) : undefined,
    });
  }

  toJson(): any {
    return {
      lessonId: this.lessonId,
      fileResourceId: this.fileResourceId,
      lesson: this.lesson?.toJson(),
    };
  }
}
