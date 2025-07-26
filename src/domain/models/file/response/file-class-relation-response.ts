import { FileResourcesResponse } from "./file-resources-response";

export class FileClassRelationResponse {
  id?: string;
  classId?: string;
  fileResourceId?: string;
  fileResources?: FileResourcesResponse;

  constructor(init?: Partial<FileClassRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileClassRelationResponse {
    return new FileClassRelationResponse({
      id: json.id,
      classId: json.classId,
      fileResourceId: json.fileResourceId,
      fileResources: json.fileResources ? FileResourcesResponse.fromJson(json.fileResources) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      classId: this.classId,
      fileResourceId: this.fileResourceId,
      fileResources: this.fileResources?.toJson(),
    };
  }
}
