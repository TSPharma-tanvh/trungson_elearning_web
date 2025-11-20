import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { type GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { type UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';

export interface QuizRepository {
  getQuizListInfo: (request: GetQuizRequest) => Promise<ApiPaginationResponse>;

  getQuizById: (id: string) => Promise<ApiResponse>;

  createQuiz: (request: CreateQuizRequest) => Promise<ApiResponse>;

  // createQuizFromExcel: (request: CreateQuizFromExcelRequest) => Promise<ApiResponse>;

  updateQuiz: (request: UpdateQuizRequest) => Promise<ApiResponse>;
}
