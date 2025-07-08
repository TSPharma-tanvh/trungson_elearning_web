import { QuestionResponse } from './question-response';

export interface QuestionListResult {
  questions: QuestionResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
