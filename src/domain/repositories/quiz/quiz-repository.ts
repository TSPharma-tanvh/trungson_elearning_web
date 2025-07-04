import { ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';

export interface QuizRepository {
  getQuizListInfo(request: GetQuizRequest): Promise<ApiPaginationResponse>;

  getQuizById(id: string): Promise<ApiResponse>;

  createQuiz(request: CreateQuizRequest): Promise<ApiResponse>;

  createQuizFromExcel(request: CreateQuizFromExcelRequest): Promise<ApiResponse>;

  updateQuiz(request: UpdateQuizRequest): Promise<ApiResponse>;
}
