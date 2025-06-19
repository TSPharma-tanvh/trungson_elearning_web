import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';

export interface EnrollmentCriteriaRepository {
  getEnrollmentList(request: GetEnrollmentCriteriaRequest): Promise<ApiPaginationResponse>;

  getEnrollmentById(id: string): Promise<ApiResponse>;
}
