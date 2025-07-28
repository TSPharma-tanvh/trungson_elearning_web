import { type EnrollmentCriteriaDetailResponse } from './enrollment-criteria-detail-response';

export interface EnrollmentCriteriaListResult {
  enrollments: EnrollmentCriteriaDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
