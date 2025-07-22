import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { UserLessonProgressDetailListResult } from '@/domain/models/user-lesson/response/user-lesson-detail-result';
import { UserLessonResponse } from '@/domain/models/user-lesson/response/user-lesson-response';
import { UserLessonProgressRepository } from '@/domain/repositories/progress/user-lesson-progress-repository';
import { StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class UserLessonProgressUsecase {
  constructor(private readonly userLessonProgressRepo: UserLessonProgressRepository) {}

  async getUserLessonProgressListInfo(
    request: GetUserLessonProgressRequest
  ): Promise<UserLessonProgressDetailListResult> {
    const result = await this.userLessonProgressRepo.getUserLessonProgressListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(UserLessonProgressDetailResponse.fromJSON);

    return {
      progress: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getUserLessonProgressById(id: string): Promise<UserLessonProgressDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.userLessonProgressRepo.getUserLessonProgressById(id);

    var userResponse = UserLessonProgressDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createUserLessonProgress(request: CreateUserLessonRequest): Promise<ApiResponse> {
    const response = await this.userLessonProgressRepo.createUserLessonProgress(request);

    return response;
  }

  async updateUserLessonProgress(request: UpdateUserLessonRequest): Promise<ApiResponse> {
    var result = await this.userLessonProgressRepo.updateUserLessonProgress(request);

    return result;
  }

  async deleteUserLessonProgress(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateUserLessonRequest({
      id: id,
      status: UserProgressEnum.Done,
    });

    var result = await this.userLessonProgressRepo.updateUserLessonProgress(newFormData);

    return result;
  }
}
