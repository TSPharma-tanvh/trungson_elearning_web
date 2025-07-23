import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateUserQuizRequest } from '@/domain/models/user-quiz/request/create-user-quiz-request';
import { GetUserQuizProgressRequest } from '@/domain/models/user-quiz/request/get-user-quiz-progress-request';
import { UpdateUserQuizRequest } from '@/domain/models/user-quiz/request/update-quiz-progress-request';

export interface UserQuizProgressRepository {
  getUserQuizProgressListInfo(request: GetUserQuizProgressRequest): Promise<ApiPaginationResponse>;

  getUserQuizProgressById(id: string): Promise<ApiResponse>;

  createUserQuizProgress(request: CreateUserQuizRequest): Promise<ApiResponse>;

  updateUserQuizProgress(request: UpdateUserQuizRequest): Promise<ApiResponse>;
}
