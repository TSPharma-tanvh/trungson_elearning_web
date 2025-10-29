import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class EnrollmentCriteriaClassRelationResponse {
  id!: string;
  classId!: string;
  enrollmentCriteriaId!: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaClassRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaClassRelationResponse {
    return new EnrollmentCriteriaClassRelationResponse({
      id: json.id,
      classId: json.classId,
      enrollmentCriteriaId: json.enrollmentCriteriaId,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      classId: this.classId,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
    };
  }
}
