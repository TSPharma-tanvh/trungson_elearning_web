import { type ApiResponse } from '@/domain/models/core/api-response';
import { type UpdateUserAnswerRequest } from '@/domain/models/user-answer/request/update-user-answer-request';
import { type UserAnswerRepository } from '@/domain/repositories/progress/user-answer-progress-repository';

export class UserAnswerUsecase {
  constructor(private readonly userAnswerRepo: UserAnswerRepository) {}

  async updateUserAnswer(request: UpdateUserAnswerRequest): Promise<ApiResponse> {
    const result = await this.userAnswerRepo.updateUserAnswer(request);

    return result;
  }
}
