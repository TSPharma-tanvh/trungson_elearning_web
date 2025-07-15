import { StatusEnum } from '@/utils/enum/core-enum';

export class GetAnswerRequest {
  questionID?: string;
  answerText?: string;
  isCorrect?: boolean;
  searchText?: string;
  status?: StatusEnum;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetAnswerRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetAnswerRequest {
    return new GetAnswerRequest(json);
  }

  toJSON(): any {
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
