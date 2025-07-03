import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateClassTeacherRequest } from '@/domain/models/teacher/request/create-class-teacher-request';
import { GetClassTeacherRequest } from '@/domain/models/teacher/request/get-class-teacher-request';
import { UpdateClassTeacherRequest } from '@/domain/models/teacher/request/update-class-teacher-request';
import { ClassTeacherResponse } from '@/domain/models/teacher/response/class-teacher-response';
import { ClassTeacherListResult } from '@/domain/models/teacher/response/class-teacher-result';
import { ClassTeacherRepository } from '@/domain/repositories/class/class-teacher-repository';
import { ActiveEnum, ScheduleStatusEnum, StatusEnum } from '@/utils/enum/core-enum';

export class ClassTeacherUsecase {
  constructor(private readonly ClassTeacherRepo: ClassTeacherRepository) {}

  async getClassTeacherListInfo(request: GetClassTeacherRequest): Promise<ClassTeacherListResult> {
    const result = await this.ClassTeacherRepo.getClassTeacherListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(ClassTeacherResponse.fromJson);

    return {
      teachers: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getClassTeacherById(id: string): Promise<ClassTeacherResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.ClassTeacherRepo.getClassTeacherById(id);

    var userResponse = ClassTeacherResponse.fromJson(result.result);

    return userResponse;
  }

  async createClassTeacher(request: CreateClassTeacherRequest): Promise<ApiResponse> {
    const response = await this.ClassTeacherRepo.createClassTeacher(request);

    return response;
  }

  async updateClassTeacher(request: UpdateClassTeacherRequest): Promise<ApiResponse> {
    var result = await this.ClassTeacherRepo.updateClassTeacher(request);

    return result;
  }

  async deleteClassTeacher(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateClassTeacherRequest({
      id: id ?? '',
      status: ActiveEnum[ActiveEnum.Inactive],
    });
    var result = await this.ClassTeacherRepo.updateClassTeacher(newFormData);
    return result;
  }
}
