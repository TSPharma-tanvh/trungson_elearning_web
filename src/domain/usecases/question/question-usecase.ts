import { type ApiResponse } from '@/domain/models/core/api-response';
import { type CreateQuestionsFromExcelDto } from '@/domain/models/question/request/create-question-from-excel-request';
import { type CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { type GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { type QuestionListResult } from '@/domain/models/question/response/question-result';
import { type QuestionRepository } from '@/domain/repositories/question/question-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class QuestionUsecase {
  constructor(private readonly courseRepo: QuestionRepository) {}

  async getQuestionListInfo(request: GetQuestionRequest): Promise<QuestionListResult> {
    const result = await this.courseRepo.getQuestionListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load question list.');
    }

    // const data = result.result.map(QuestionResponse.fromJson);
    const data = result.result.map((x) => QuestionResponse.fromJson(x));

    return {
      questions: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getQuestionById(id: string): Promise<QuestionResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    const result = await this.courseRepo.getQuestionById(id);

    const userResponse = QuestionResponse.fromJson(result.result);

    return userResponse;
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.createQuestion(request);

    return response;
  }

  async createQuestionByExcel(request: CreateQuestionsFromExcelDto): Promise<ApiResponse> {
    const response = await this.courseRepo.createQuestionByExcel(request);

    return response;
  }

  async updateQuestion(request: UpdateQuestionRequest): Promise<ApiResponse> {
    const result = await this.courseRepo.updateQuestion(request);

    return result;
  }

  async deleteQuestion(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateQuestionRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    const result = await this.courseRepo.updateQuestion(newFormData);

    return result;
  }
}
