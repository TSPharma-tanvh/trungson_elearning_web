import { FileResourcesResponse } from './file-resources-response';

export class FileLessonRelationResponse {
  lessonId?: string;
  fileResourceId?: string;
  fileResources?: FileResourcesResponse;

  constructor(init?: Partial<FileLessonRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileLessonRelationResponse {
    return new FileLessonRelationResponse({
      lessonId: json.lessonId,
      fileResourceId: json.fileResourceId,
      fileResources: json.fileResources ? FileResourcesResponse.fromJson(json.fileResources) : undefined,
    });
  }

  toJson(): any {
    return {
      lessonId: this.lessonId,
      fileResourceId: this.fileResourceId,
      fileResources: this.fileResources?.toJson(),
    };
  }
}
