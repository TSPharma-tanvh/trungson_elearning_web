import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';

export class EnrollmentCriteriaCourseRelationResponse {
  id = '';
  enrollmentCriteriaID = '';
  courseID = '';
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaCourseRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaCourseRelationResponse {
    return new EnrollmentCriteriaCourseRelationResponse({
      id: json.id,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      courseID: json.courseID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      courseID: this.courseID,
      enrollmentCriteria: this.enrollmentCriteria ? this.enrollmentCriteria.toJson() : undefined,
    };
  }
}
