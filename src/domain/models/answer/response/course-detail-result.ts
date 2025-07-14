import { AnswerDetailResponse } from './answer-detail-response';

export interface AnswerDetailListResult {
  answers: AnswerDetailResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
