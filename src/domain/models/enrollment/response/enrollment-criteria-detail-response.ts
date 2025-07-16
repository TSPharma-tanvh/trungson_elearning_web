import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { CourseResponse } from '../../courses/response/course-response';
import { CoursePathResponse } from '../../path/response/course-path-response';
import { QuizResponse } from '../../quiz/response/quiz-response';
import { EnrollmentCriteriaCourseRelation } from './enrollment-criteria-course-relation-response';

export class EnrollmentCriteriaDetailResponse {
  id: string = '';
  name?: string;
  desc?: string;
  enrollmentCriteriaType: string = '';
  enrollmentStatus?: string;
  maxCapacity?: number;
  targetLevelID?: string;
  pathID?: string;
  path?: CoursePathResponse;
  courseID?: string;
  courses?: CourseResponse;
  classID?: string;
  class?: ClassResponse;
  quizID?: string;
  quiz?: QuizResponse;
  targetPharmacyID?: string;
  enrollments?: EnrollmentResponse[];
  courseEnrollments?: EnrollmentCriteriaCourseRelation[];

  constructor(init?: Partial<EnrollmentCriteriaDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaDetailResponse {
    return new EnrollmentCriteriaDetailResponse({
      id: json.id,
      name: json.name,
      desc: json.desc,
      enrollmentCriteriaType: json.enrollmentCriteriaType,
      enrollmentStatus: json.enrollmentStatus,
      maxCapacity: json.maxCapacity,
      targetLevelID: json.targetLevelID,
      pathID: json.pathID,
      path: json.path ? CoursePathResponse.fromJson(json.path) : undefined,
      courseID: json.courseID,
      courses: json.courses ? CourseResponse.fromJson(json.courses) : undefined,
      classID: json.classID,
      class: json.class ? ClassResponse.fromJson(json.class) : undefined,
      quizID: json.quizID,
      quiz: json.quiz ? QuizResponse.fromJSON(json.quiz) : undefined,
      targetPharmacyID: json.targetPharmacyID,
      enrollments: json.enrollments?.map((e: any) => EnrollmentResponse.fromJson(e)),
      courseEnrollments: json.courseEnrollments?.map((ce: any) => EnrollmentCriteriaCourseRelation.fromJson(ce)),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      enrollmentStatus: this.enrollmentStatus,
      maxCapacity: this.maxCapacity,
      targetLevelID: this.targetLevelID,
      pathID: this.pathID,
      path: this.path ? this.path.toJson() : undefined,
      courseID: this.courseID,
      courses: this.courses ? this.courses.toJson() : undefined,
      classID: this.classID,
      class: this.class ? this.class.toJson() : undefined,
      quizID: this.quizID,
      quiz: this.quiz ? this.quiz.toJSON() : undefined,
      targetPharmacyID: this.targetPharmacyID,
      enrollments: this.enrollments?.map((e) => e.toJson()),
      courseEnrollments: this.courseEnrollments?.map((ce) => ce.toJson()),
    };
  }
}
