import { QuizResponse } from './quiz-response';

export interface QuizListResult {
  quizzes: QuizResponse[];
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
}
