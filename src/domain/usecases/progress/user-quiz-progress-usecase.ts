import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizLiveStatusRequest } from '@/domain/models/user-quiz/request/get-user-quiz-live-status-request';
import { type GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';
import { UserQuizProgressDetailResponse } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-response';
import { type UserQuizProgressDetailListResult } from '@/domain/models/user-quiz/response/user-quiz-progress-detail-result';
import { type UserQuizProgressRepository } from '@/domain/repositories/progress/user-quiz-progress-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class UserQuizProgressUsecase {
  constructor(private readonly userQuizProgressRepo: UserQuizProgressRepository) {}

  async getUserQuizProgressListInfo(request: GetUserQuizProgressRequest): Promise<UserQuizProgressDetailListResult> {
    const result = await this.userQuizProgressRepo.getUserQuizProgressListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(UserQuizProgressDetailResponse.fromJson);
    const data = result.result.map((x) => UserQuizProgressDetailResponse.fromJson(x));

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

    const result = await this.userQuizProgressRepo.getUserQuizProgressById(id);

    const userResponse = UserQuizProgressDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createUserQuizProgress(request: CreateUserQuizRequest): Promise<ApiResponse> {
    const response = await this.userQuizProgressRepo.createUserQuizProgress(request);

    return response;
  }

  async updateUserQuizProgress(request: UpdateUserQuizRequest): Promise<ApiResponse> {
    const result = await this.userQuizProgressRepo.updateUserQuizProgress(request);

    return result;
  }

  async deleteUserQuizProgress(userId: string, quizId: string): Promise<ApiResponse> {
    const newFormData = new UpdateUserQuizRequest({
      userID: userId,
      quizID: quizId,
      activeStatus: StatusEnum.Deleted,
    });

    const result = await this.userQuizProgressRepo.updateUserQuizProgress(newFormData);

    return result;
  }

  async getUserQuizLiveStatus(request: GetUserQuizLiveStatusRequest): Promise<UserQuizProgressDetailListResult> {
    const result = await this.userQuizProgressRepo.getUserQuizLiveStatus(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    // const data = result.result.map(UserQuizProgressDetailResponse.fromJson);
    const data = result.result.map((x) => UserQuizProgressDetailResponse.fromJson(x));

    return {
      progress: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }
}
