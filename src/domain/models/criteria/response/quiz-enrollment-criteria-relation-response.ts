import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class QuizEnrollmentCriteriaRelationResponse {
  id = '';
  quizID = '';
  enrollmentCriteria!: EnrollmentCriteriaResponse;

  constructor(init?: Partial<QuizEnrollmentCriteriaRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): QuizEnrollmentCriteriaRelationResponse {
    return new QuizEnrollmentCriteriaRelationResponse({
      id: json.id,
      quizID: json.quizID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
        : new EnrollmentCriteriaResponse(),
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      quizID: this.quizID,
      enrollmentCriteria: this.enrollmentCriteria ? this.enrollmentCriteria.toJSON() : null,
    };
  }
}
