import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateQuizFromExcelRequest } from '@/domain/models/quiz/request/create-quiz-from-excel-request';
import { type CreateQuizRequest } from '@/domain/models/quiz/request/create-quiz-request';
import { type GetQuizRequest } from '@/domain/models/quiz/request/get-quiz-request';
import { UpdateQuizRequest } from '@/domain/models/quiz/request/update-quiz-request';
import { QuizResponse } from '@/domain/models/quiz/response/quiz-response';
import { type QuizListResult } from '@/domain/models/quiz/response/quiz-result';
import { type QuizRepository } from '@/domain/repositories/quiz/quiz-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class QuizUsecase {
  constructor(private readonly courseRepo: QuizRepository) {}

  async getQuizListInfo(request: GetQuizRequest): Promise<QuizListResult> {
    const result = await this.courseRepo.getQuizListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => QuizResponse.fromJson(x));

    return {
      quizzes: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getQuizById(id: string): Promise<QuizResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.courseRepo.getQuizById(id);

    const userResponse = QuizResponse.fromJson(result.result);

    return userResponse;
  }

  // async importFromExcel(request: CreateQuizFromExcelRequest): Promise<ApiResponse> {
  //   const response = await this.courseRepo.createQuizFromExcel(request);

  //   return response;
  // }

  async createQuiz(request: CreateQuizRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.createQuiz(request);

    return response;
  }

  async updateQuiz(request: UpdateQuizRequest): Promise<ApiResponse> {
    const result = await this.courseRepo.updateQuiz(request);

    return result;
  }

  async deleteQuiz(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateQuizRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    const result = await this.courseRepo.updateQuiz(newFormData);

    return result;
  }
}
