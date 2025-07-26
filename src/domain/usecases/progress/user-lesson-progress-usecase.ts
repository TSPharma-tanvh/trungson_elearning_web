import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserLessonRequest } from '@/domain/models/user-lesson/request/create-user-lesson-request';
import { type GetUserLessonProgressRequest } from '@/domain/models/user-lesson/request/get-user-lesson-request';
import { UpdateUserLessonRequest } from '@/domain/models/user-lesson/request/update-user-lesson-request';
import { UserLessonProgressDetailResponse } from '@/domain/models/user-lesson/response/user-lesson-detail-response';
import { type UserLessonProgressDetailListResult } from '@/domain/models/user-lesson/response/user-lesson-detail-result';
import { UserLessonResponse } from '@/domain/models/user-lesson/response/user-lesson-response';
import { type UserLessonProgressRepository } from '@/domain/repositories/progress/user-lesson-progress-repository';
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

    const result = await this.userLessonProgressRepo.getUserLessonProgressById(id);

    const userResponse = UserLessonProgressDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createUserLessonProgress(request: CreateUserLessonRequest): Promise<ApiResponse> {
    const response = await this.userLessonProgressRepo.createUserLessonProgress(request);

    return response;
  }

  async updateUserLessonProgress(request: UpdateUserLessonRequest): Promise<ApiResponse> {
    const result = await this.userLessonProgressRepo.updateUserLessonProgress(request);

    return result;
  }

  async deleteUserLessonProgress(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateUserLessonRequest({
      id,
      status: UserProgressEnum[UserProgressEnum.Done],
    });

    const result = await this.userLessonProgressRepo.updateUserLessonProgress(newFormData);

    return result;
  }
}
