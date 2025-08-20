import { type ApiResponse } from '@/domain/models/core/api-response';
import { type UpdateUserAnswerRequest } from '@/domain/models/user-answer/request/update-user-answer-request';

export interface UserAnswerRepository {
  updateUserAnswer: (request: UpdateUserAnswerRequest) => Promise<ApiResponse>;
}
