import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class EnrollmentCriteriaQuizRelationResponse {
  id = '';
  quizID = '';
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaQuizRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaQuizRelationResponse {
    return new EnrollmentCriteriaQuizRelationResponse({
      id: json.id,
      quizID: json.quizID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      quizID: this.quizID,
      enrollmentCriteria: this.enrollmentCriteria?.toJson(),
    };
  }
}
