import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { EnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/enrollment-criteria-request';
import { EnrollmentCriteriaRepository } from '@/domain/repositories/enrollment/enrollment-criteria-repository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

export class EnrollmentRepoImpl implements EnrollmentCriteriaRepository {
  async getEnrollmentList(request: EnrollmentCriteriaRequest): Promise<ApiPaginationResponse> {
    try {
      const response = await apiClient.get<ApiPaginationResponse>(apiEndpoints.enrollment.getAll, {
        params: request.toJSON(),
      });

      const apiResponse = response.data;

      if (!apiResponse || !apiResponse.isSuccessStatusCode) {
        throw new Error(apiResponse?.message || 'Unknown API error');
      }

      return apiResponse;
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to fetch user info');
    }
  }
}
