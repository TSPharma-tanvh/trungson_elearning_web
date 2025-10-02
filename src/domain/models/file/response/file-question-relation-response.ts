import { FileResourcesResponse } from './file-resources-response';

export class FileQuestionRelationResponse {
  id?: string;
  questionId?: string;
  fileResourceId?: string;
  fileResources?: FileResourcesResponse;

  constructor(init?: Partial<FileQuestionRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileQuestionRelationResponse {
    const dto = new FileQuestionRelationResponse();
    dto.id = json.id;
    dto.questionId = json.questionId;
    dto.fileResourceId = json.fileResourceId;
    dto.fileResources = json.fileResources ? FileResourcesResponse.fromJson(json.fileResources) : undefined;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      questionId: this.questionId,
      fileResourceId: this.fileResourceId,
      fileResources: this.fileResources?.toJson(),
    };
  }
}
