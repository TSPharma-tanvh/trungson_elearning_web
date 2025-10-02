import { type CreateAnswerRequest } from '@/domain/models/answer/request/create-answer-request';
import { type GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { AnswerDetailResponse } from '@/domain/models/answer/response/answer-detail-response';
import { type AnswerDetailListResult } from '@/domain/models/answer/response/course-detail-result';
import { type ApiResponse } from '@/domain/models/core/api-response';
import { type AnswerRepository } from '@/domain/repositories/answer/answer-repository';
import { StatusEnum } from '@/utils/enum/core-enum';

export class AnswerUsecase {
  constructor(private readonly answerRepo: AnswerRepository) {}

  async getAnswerListInfo(request: GetAnswerRequest): Promise<AnswerDetailListResult> {
    const result = await this.answerRepo.getAnswerListInfo(request);

    if (!result || !Array.isArray(result.result)) {
      throw new Error('Failed to load user list.');
    }

    const data = result.result.map((x) => AnswerDetailResponse.fromJson(x));

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

    const result = await this.answerRepo.getAnswerById(id);

    const userResponse = AnswerDetailResponse.fromJson(result.result);

    return userResponse;
  }

  async createAnswer(request: CreateAnswerRequest): Promise<ApiResponse> {
    const response = await this.answerRepo.createAnswer(request);

    return response;
  }

  async updateAnswer(request: UpdateAnswerRequest): Promise<ApiResponse> {
    const result = await this.answerRepo.updateAnswer(request);

    return result;
  }

  async deleteAnswer(id: string): Promise<ApiResponse> {
    const newFormData = new UpdateAnswerRequest({
      id: id ?? '',
      status: StatusEnum.Deleted,
    });

    const result = await this.answerRepo.updateAnswer(newFormData);

    return result;
  }
}
