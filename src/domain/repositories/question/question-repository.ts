import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { CreateQuestionsFromExcelDto } from '@/domain/models/question/request/create-question-from-excel-request';
import { type CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { type GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { type UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';

export interface QuestionRepository {
  getQuestionListInfo: (request: GetQuestionRequest) => Promise<ApiPaginationResponse>;

  getQuestionById: (id: string) => Promise<ApiResponse>;

  createQuestion: (request: CreateQuestionRequest) => Promise<ApiResponse>;

  createQuestionByExcel: (request: CreateQuestionsFromExcelDto) => Promise<ApiResponse>;

  updateQuestion: (request: UpdateQuestionRequest) => Promise<ApiResponse>;
}
