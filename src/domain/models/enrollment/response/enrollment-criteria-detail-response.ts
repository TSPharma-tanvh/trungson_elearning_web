import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentResponse } from '../../class/response/enrollment-response';
import { CourseResponse } from '../../courses/response/course-response';
import { CoursePathResponse } from '../../path/response/course-path-response';
import { QuizResponse } from '../../quiz/response/quiz-response';
import { EnrollmentCriteriaCourseRelationResponse } from './enrollment-criteria-course-relation-response';

export class EnrollmentCriteriaDetailResponse {
  id = '';
  name?: string;
  desc?: string;
  enrollmentCriteriaType = '';
  isDefault = false;
  enrollmentStatus?: string;
  maxCapacity?: number;
  targetLevelID?: string;
  targetPharmacyID?: string;

  constructor(init?: Partial<EnrollmentCriteriaDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaDetailResponse {
    return new EnrollmentCriteriaDetailResponse({
      id: json.id,
      name: json.name,
      desc: json.desc,
      enrollmentCriteriaType: json.enrollmentCriteriaType,
      isDefault: json.isDefault ?? false,
      enrollmentStatus: json.enrollmentStatus,
      maxCapacity: json.maxCapacity,
      targetLevelID: json.targetLevelID,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      isDefault: this.isDefault,
      enrollmentStatus: this.enrollmentStatus,
      maxCapacity: this.maxCapacity,
      targetLevelID: this.targetLevelID,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
