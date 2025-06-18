import { EnrollmentCriteriaResponse } from '@/domain/models/criteria/response/enrollment-criteria-response';
import { EnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/enrollment-criteria-request';
import { EnrollmentCriteriaListResult } from '@/domain/models/enrollment/response/enrollment-criteria-result';
import { EnrollmentCriteriaRepository } from '@/domain/repositories/enrollment/enrollment-criteria-repository';

export class EnrollmentUsecase {
  constructor(private readonly enrollRepo: EnrollmentCriteriaRepository) {}

  async getEnrollmentList(request: EnrollmentCriteriaRequest): Promise<EnrollmentCriteriaListResult> {
    const result = await this.enrollRepo.getEnrollmentList(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(EnrollmentCriteriaResponse.fromJSON);

    return {
      enrollments: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }
}
