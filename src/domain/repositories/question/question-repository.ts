import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';

export interface QuestionRepository {
  getQuestionListInfo(request: GetQuestionRequest): Promise<ApiPaginationResponse>;

  getQuestionById(id: string): Promise<ApiResponse>;

  createQuestion(request: CreateQuestionRequest): Promise<ApiResponse>;

  updateQuestion(request: UpdateQuestionRequest): Promise<ApiResponse>;
}
