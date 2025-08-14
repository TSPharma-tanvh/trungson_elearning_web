import { EnrollmentCriteriaResponse } from './enrollment-criteria-response';

export class EnrollmentCriteriaCourseRelation {
  id!: string;
  enrollmentCriteriaID!: string;
  courseID!: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse;

  constructor(init?: Partial<EnrollmentCriteriaCourseRelation>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaCourseRelation {
    if (!json) return new EnrollmentCriteriaCourseRelation();

    return new EnrollmentCriteriaCourseRelation({
      id: json.id,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      courseID: json.courseID,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
        : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      courseID: this.courseID,
      enrollmentCriteria: this.enrollmentCriteria ? this.enrollmentCriteria.toJSON() : undefined,
    };
  }
}
