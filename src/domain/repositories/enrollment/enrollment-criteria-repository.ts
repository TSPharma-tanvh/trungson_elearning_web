import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';

export interface EnrollmentCriteriaRepository {
  getEnrollmentList(request: GetEnrollmentCriteriaRequest): Promise<ApiPaginationResponse>;

  getEnrollmentById(id: string): Promise<ApiResponse>;

  createEnrollment(request: CreateEnrollmentCriteriaRequest): Promise<ApiResponse>;

  updateEnrollment(request: UpdateEnrollmentCriteriaRequest): Promise<ApiResponse>;
}
