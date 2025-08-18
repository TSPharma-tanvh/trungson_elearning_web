import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizLiveStatusRequest } from '@/domain/models/user-quiz/request/get-user-quiz-live-status-request';
import { type GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { type UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';

export interface UserQuizProgressRepository {
  getUserQuizProgressListInfo: (request: GetUserQuizProgressRequest) => Promise<ApiPaginationResponse>;

  getUserQuizProgressById: (id: string) => Promise<ApiResponse>;

  createUserQuizProgress: (request: CreateUserQuizRequest) => Promise<ApiResponse>;

  updateUserQuizProgress: (request: UpdateUserQuizRequest) => Promise<ApiResponse>;

  getUserQuizLiveStatus: (request: GetUserQuizLiveStatusRequest) => Promise<ApiPaginationResponse>;
}
