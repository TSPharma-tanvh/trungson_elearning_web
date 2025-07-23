import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { UserQuizProgressDetailListResult } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-result';
import { UserQuizProgressRepository } from '@/domain/repositories/progress/user-quiz-progress-repository';
import { StatusEnum, UserProgressEnum } from '@/utils/enum/core-enum';

export class UserQuizProgressUsecase {
  constructor(private readonly userQuizProgressRepo: UserQuizProgressRepository) {}

  async getUserQuizProgressListInfo(request: GetUserQuizProgressRequest): Promise<UserQuizProgressDetailListResult> {
    const result = await this.userQuizProgressRepo.getUserQuizProgressListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(UserQuizProgressDetailResponse.fromJson);

    return {
      progress: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getUserQuizProgressById(id: string): Promise<UserQuizProgressDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.userQuizProgressRepo.getUserQuizProgressById(id);

    var userResponse = UserQuizProgressDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createUserQuizProgress(request: CreateUserQuizRequest): Promise<ApiResponse> {
    const response = await this.userQuizProgressRepo.createUserQuizProgress(request);

    return response;
  }

  async updateUserQuizProgress(request: UpdateUserQuizRequest): Promise<ApiResponse> {
    var result = await this.userQuizProgressRepo.updateUserQuizProgress(request);

    return result;
  }

  async deleteUserQuizProgress(id: string[]): Promise<ApiResponse> {
    const newFormData = new UpdateUserQuizRequest({
      userIDs: id,
      progressStatus: UserProgressEnum.Done,
    });

    var result = await this.userQuizProgressRepo.updateUserQuizProgress(newFormData);

    return result;
  }
}
