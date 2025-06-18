import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { EnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/enrollment-criteria-request';

export interface EnrollmentCriteriaRepository {
  getEnrollmentList(request: EnrollmentCriteriaRequest): Promise<ApiPaginationResponse>;
}