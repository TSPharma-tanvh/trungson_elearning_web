import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from './file-resources-response';

export class FileClassQRRelationResponse {
  id: string = '';
  classId?: string;
  fileResourceId?: string;
  enrollmentCriteriaId?: string;
  class?: ClassResponse;
  fileResources?: FileResourcesResponse;
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<FileClassQRRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileClassQRRelationResponse {
    return new FileClassQRRelationResponse({
      id: json.id,
      classId: json.classId,
      fileResourceId: json.fileResourceId,
      enrollmentCriteriaId: json.enrollmentCriteriaId,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      fileResources: json.fileResources ? FileResourcesResponse.fromJson(json.fileResources) : undefined,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      classId: this.classId,
      fileResourceId: this.fileResourceId,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      class: this.class?.toJson(),
      fileResources: this.fileResources?.toJson(),
      enrollmentCriteria: this.enrollmentCriteria?.toJSON(),
    };
  }
}
