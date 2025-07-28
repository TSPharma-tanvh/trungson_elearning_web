import { type CreateClassRequest } from '@/domain/models/class/request/create-class-request';
import { type GetClassRequest } from '@/domain/models/class/request/get-class-request';
import { UpdateClassRequest } from '@/domain/models/class/request/update-class-request';
import { ClassResponse } from '@/domain/models/class/response/class-response';
import { type ClassListResult } from '@/domain/models/class/response/class-result';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type ClassRepository } from '@/domain/repositories/class/class-repository';
import { ScheduleStatusEnum } from '@/utils/enum/core-enum';

export class ClassUsecase {
  constructor(private readonly ClassRepo: ClassRepository) {}

  async getClassListInfo(request: GetClassRequest): Promise<ClassListResult> {
    const result = await this.ClassRepo.getClassListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(ClassResponse.fromJson);
    const data = result.result.map((x) => ClassResponse.fromJson(x));

    return {
      class: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getClassById(id: string): Promise<ClassResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.ClassRepo.getClassById(id);

    const userResponse = ClassResponse.fromJson(result.result);

    return userResponse;
  }

  async createClass(request: CreateClassRequest): Promise<ApiResponse> {
    const response = await this.ClassRepo.createClass(request);

    return response;
  }

  async updateClass(request: UpdateClassRequest): Promise<ApiResponse> {
    const result = await this.ClassRepo.updateClass(request);

    return result;
  }

  async deleteClass(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateClassRequest({
      id: id ?? '',
      scheduleStatus: ScheduleStatusEnum.Cancelled,
    });
    const result = await this.ClassRepo.updateClass(newFormData);
    return result;
  }
}
