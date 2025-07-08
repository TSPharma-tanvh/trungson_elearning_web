import { ApiResponse } from '@/domain/models/core/api-response';
import { CreateQuestionRequest } from '@/domain/models/question/request/create-question-request';
import { GetQuestionRequest } from '@/domain/models/question/request/get-question-request';
import { UpdateQuestionRequest } from '@/domain/models/question/request/update-question-request';
import { QuestionResponse } from '@/domain/models/question/response/question-response';
import { QuestionListResult } from '@/domain/models/question/response/question-result';
import { QuestionRepository } from '@/domain/repositories/question/question-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class QuestionUsecase {
  constructor(private readonly courseRepo: QuestionRepository) {}

  async getQuestionListInfo(request: GetQuestionRequest): Promise<QuestionListResult> {
    const result = await this.courseRepo.getQuestionListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(QuestionResponse.fromJSON);

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

    var result = await this.courseRepo.getQuestionById(id);

    var userResponse = QuestionResponse.fromJSON(result.result);

    return userResponse;
  }

  async createQuestion(request: CreateQuestionRequest): Promise<ApiResponse> {
    const response = await this.courseRepo.createQuestion(request);

    return response;
  }

  async updateQuestion(request: UpdateQuestionRequest): Promise<ApiResponse> {
    var result = await this.courseRepo.updateQuestion(request);

    return result;
  }

  async deleteQuestion(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateQuestionRequest({
      id: id ?? '',
    });

    var result = await this.courseRepo.updateQuestion(newFormData);

    return result;
  }
}
