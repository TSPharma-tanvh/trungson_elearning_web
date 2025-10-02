import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class QuizEnrollmentCriteriaRelationResponse {
  id = '';
  quizID = '';
  enrollmentCriteria!: EnrollmentCriteriaResponse;

  constructor(init?: Partial<QuizEnrollmentCriteriaRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuizEnrollmentCriteriaRelationResponse {
    return new QuizEnrollmentCriteriaRelationResponse({
      id: json.id,
      quizID: json.quizID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJson(json.enrollmentCriteria)
        : new EnrollmentCriteriaResponse(),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      quizID: this.quizID,
      enrollmentCriteria: this.enrollmentCriteria ? this.enrollmentCriteria.toJson() : null,
    };
  }
}
