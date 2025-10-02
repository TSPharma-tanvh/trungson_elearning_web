import { type StatusEnum } from '@/utils/enum/core-enum';

export class GetAnswerRequest {
  questionID?: string;
  answerText?: string;
  isCorrect?: boolean;
  searchText?: string;
  status?: StatusEnum;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetAnswerRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetAnswerRequest {
    return new GetAnswerRequest(json);
  }

  toJson(): any {
    return {
      questionID: this.questionID,
      answerText: this.answerText,
      isCorrect: this.isCorrect,
      searchText: this.searchText,
      status: this.status,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
