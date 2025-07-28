import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/create-enrollment-criteria-request';
import { type GetEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/get-enrollment-criteria-request';
import { UpdateEnrollmentCriteriaRequest } from '@/domain/models/enrollment/request/update-enrollment-criteria-request';
import { EnrollmentCriteriaDetailResponse } from '@/domain/models/enrollment/response/enrollment-criteria-detail-response';
import { type EnrollmentCriteriaListResult } from '@/domain/models/enrollment/response/enrollment-criteria-result';
import { type EnrollmentCriteriaRepository } from '@/domain/repositories/enrollment/enrollment-criteria-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class EnrollmentUsecase {
  constructor(private readonly enrollRepo: EnrollmentCriteriaRepository) {}

  async getEnrollmentList(request: GetEnrollmentCriteriaRequest): Promise<EnrollmentCriteriaListResult> {
    const result = await this.enrollRepo.getEnrollmentList(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load enrollment list.');
    }

    // const data = result.result.map(EnrollmentCriteriaDetailResponse.fromJson);
    const data = result.result.map((x) => EnrollmentCriteriaDetailResponse.fromJson(x));

    return {
      enrollments: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getEnrollmentById(id: string): Promise<EnrollmentCriteriaDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.enrollRepo.getEnrollmentById(id);

    const userResponse = EnrollmentCriteriaDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createEnrollment(request: CreateEnrollmentCriteriaRequest): Promise<ApiResponse> {
    const response = await this.enrollRepo.createEnrollment(request);

    return response;
  }

  async updateEnrollment(request: UpdateEnrollmentCriteriaRequest): Promise<ApiResponse> {
    const response = await this.enrollRepo.updateEnrollment(request);

    return response;
  }

  async deleteEnrollment(id: string): Promise<ApiResponse> {
    const request = new UpdateEnrollmentCriteriaRequest({
      id,
      enrollmentStatus: StatusEnum.Deleted,
    });
    return await this.enrollRepo.updateEnrollment(request);
  }
}
