import { type CreateAnswerRequest } from '@/domain/models/answer/request/create-answer-request';
import { type GetAnswerRequest } from '@/domain/models/answer/request/get-answer-request';
import { type UpdateAnswerRequest } from '@/domain/models/answer/request/update-answer-request';
import { type ApiPaginationResponse } from '@/domain/models/core/api-pagination-response';
import { type ApiResponse } from '@/domain/models/core/api-response';

export interface AnswerRepository {
  getAnswerListInfo: (request: GetAnswerRequest) => Promise<ApiPaginationResponse>;

  getAnswerById: (id: string) => Promise<ApiResponse>;

  createAnswer: (request: CreateAnswerRequest) => Promise<ApiResponse>;

  updateAnswer: (request: UpdateAnswerRequest) => Promise<ApiResponse>;
}
