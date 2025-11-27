import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentCriteriaResponse } from '../../enrollment/response/enrollment-criteria-response';

export class FileClassQRRelationResponseForResource {
  id = '';
  classId?: string;
  fileResourceId?: string;
  enrollmentCriteriaId?: string;
  class?: ClassResponse;
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<FileClassQRRelationResponseForResource>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileClassQRRelationResponseForResource {
    if (!json) return new FileClassQRRelationResponseForResource();
    return new FileClassQRRelationResponseForResource({
      id: json.id,
      classId: json.classId,
      fileResourceId: json.fileResourceId,
      enrollmentCriteriaId: json.enrollmentCriteriaId,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
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
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
    };
  }
}
