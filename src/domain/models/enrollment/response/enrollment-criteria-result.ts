import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';

export interface EnrollmentCriteriaListResult {
  enrollments: EnrollmentCriteriaResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
