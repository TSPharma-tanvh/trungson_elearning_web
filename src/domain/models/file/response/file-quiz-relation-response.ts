import { FileResourcesResponse } from "./file-resources-response";

export class FileQuizRelationResponse {
  id?: string;
  quizId?: string;
  fileResourceId?: string;
  fileResources?: FileResourcesResponse;

  constructor(init?: Partial<FileQuizRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): FileQuizRelationResponse {
    return new FileQuizRelationResponse({
      id: json.id,
      quizId: json.quizId,
      fileResourceId: json.fileResourceId,
      fileResources: json.fileResources ? FileResourcesResponse.fromJson(json.fileResources) : undefined,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      quizId: this.quizId,
      fileResourceId: this.fileResourceId,
      fileResources: this.fileResources?.toJson?.() ?? this.fileResources,
    };
  }
}
