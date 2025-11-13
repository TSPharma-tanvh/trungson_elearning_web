import { ClassResponse } from '../../class/response/class-response';

export class FileClassRelationResponseForResource {
  id?: string;
  classId?: string;
  fileResourceId?: string;
  class?: ClassResponse;

  constructor(init?: Partial<FileClassRelationResponseForResource>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileClassRelationResponseForResource {
    if (!json) return new FileClassRelationResponseForResource();
    return new FileClassRelationResponseForResource({
      id: json.id,
      classId: json.classId,
      fileResourceId: json.fileResourceId,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      classId: this.classId,
      fileResourceId: this.fileResourceId,
      class: this.class?.toJson(),
    };
  }
}
