import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class EnrollmentCriteriaPathRelationResponse {
  id = '';
  enrollmentCriteriaID = '';
  pathID = '';
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaPathRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaPathRelationResponse {
    return new EnrollmentCriteriaPathRelationResponse({
      id: json.id,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      pathID: json.pathID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      pathID: this.pathID,
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
    };
  }
}
