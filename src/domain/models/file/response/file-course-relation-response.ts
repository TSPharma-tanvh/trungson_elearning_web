import { FileResourcesResponse } from './file-resources-response';

export class FileCourseRelationResponse {
  id?: string;
  courseId?: string;
  fileResourceId?: string;
  fileResources?: FileResourcesResponse;

  constructor(data?: Partial<FileCourseRelationResponse>) {
    Object.assign(this, data);
  }

  static fromJson(json: any): FileCourseRelationResponse {
    if (!json) return new FileCourseRelationResponse();

    return new FileCourseRelationResponse({
      id: json.id ?? json.Id ?? undefined,
      courseId: json.courseId ?? json.CourseId ?? undefined,
      fileResourceId: json.fileResourceId ?? json.FileResourceId ?? undefined,
      fileResources: json.fileResources
        ? FileResourcesResponse.fromJson(json.fileResources)
        : json.FileResources
          ? FileResourcesResponse.fromJson(json.FileResources)
          : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      courseId: this.courseId,
      fileResourceId: this.fileResourceId,
      fileResources: this.fileResources ? this.fileResources.toJson() : undefined,
    };
  }
}
