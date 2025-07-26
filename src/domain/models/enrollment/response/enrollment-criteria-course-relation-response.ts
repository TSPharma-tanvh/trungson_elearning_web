import { CourseResponse } from '../../courses/response/course-response';

export class EnrollmentCriteriaCourseRelation {
  id = '';
  enrollmentCriteriaID = '';
  courseID = '';
  course?: CourseResponse;

  constructor(init?: Partial<EnrollmentCriteriaCourseRelation>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaCourseRelation {
    return new EnrollmentCriteriaCourseRelation({
      id: json.id,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      courseID: json.courseID,
      course: json.course ? CourseResponse.fromJson(json.course) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      courseID: this.courseID,
      course: this.course ? this.course.toJson() : undefined,
    };
  }
}
