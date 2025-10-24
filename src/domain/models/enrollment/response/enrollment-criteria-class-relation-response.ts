import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class EnrollmentCriteriaClassRelationResponse {
  id = '';
  enrollmentCriteriaID = '';
  classID = '';
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaClassRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaClassRelationResponse {
    return new EnrollmentCriteriaClassRelationResponse({
      id: json.id,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      classID: json.classID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      classID: this.classID,
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
    };
  }
}
