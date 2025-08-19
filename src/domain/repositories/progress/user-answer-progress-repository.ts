import { ApiResponse } from '@/domain/models/core/api-response';
import { UpdateUserAnswerRequest } from '@/domain/models/user-answer/request/update-user-answer-request';

export interface UserAnswerRepository {
  updateUserAnswer: (request: UpdateUserAnswerRequest) => Promise<ApiResponse>;
}
