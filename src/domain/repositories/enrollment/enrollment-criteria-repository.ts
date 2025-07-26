import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { type GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { type UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';

export interface EnrollmentCriteriaRepository {
  getEnrollmentList: (request: GetEnrollmentCriteriaRequest) => Promise<ApiPaginationResponse>;

  getEnrollmentById: (id: string) => Promise<ApiResponse>;

  createEnrollment: (request: CreateEnrollmentCriteriaRequest) => Promise<ApiResponse>;

  updateEnrollment: (request: UpdateEnrollmentCriteriaRequest) => Promise<ApiResponse>;
}
