import { CreateAnswerRequest } from '@/domain/models/answer/request/create-answer-request';
import { GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { AnswerDetailListResult } from '@/domain/models/answer/response/course-detail-result';
import { ApiResponse } from '@/domain/models/core/api-response';
import { AnswerRepository } from '@/domain/repositories/answer/answer-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class AnswerUsecase {
  constructor(private readonly answerRepo: AnswerRepository) {}

  async getAnswerListInfo(request: GetAnswerRequest): Promise<AnswerDetailListResult> {
    const result = await this.answerRepo.getAnswerListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map(AnswerDetailResponse.fromJSON);

    return {
      answers: data,
      totalRecords: result.totalRecords ?? result.result.length,
      pageSize: result.pageSize ?? request.pageSize,
      pageNumber: result.pageNumber ?? request.pageNumber,
    };
  }

  async getAnswerById(id: string): Promise<AnswerDetailResponse> {
    if (id === null || id === undefined || id.trim() === '') {
      throw new Error('ID is missing.');
    }

    var result = await this.answerRepo.getAnswerById(id);

    var userResponse = AnswerDetailResponse.fromJSON(result.result);

    return userResponse;
  }

  async createAnswer(request: CreateAnswerRequest): Promise<ApiResponse> {
    const response = await this.answerRepo.createAnswer(request);

    return response;
  }

  async updateAnswer(request: UpdateAnswerRequest): Promise<ApiResponse> {
    var result = await this.answerRepo.updateAnswer(request);

    return result;
  }

  async deleteAnswer(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateAnswerRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    var result = await this.answerRepo.updateAnswer(newFormData);

    return result;
  }
}
