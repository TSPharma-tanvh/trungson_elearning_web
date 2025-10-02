export class GetQuestionRequest {
  quizID?: string;
  questionText?: string;
  minAnswers?: number;
  maxAnswers?: number;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetQuestionRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetQuestionRequest {
    return new GetQuestionRequest({
      quizID: json.quizID,
      questionText: json.questionText,
      minAnswers: json.minAnswers,
      maxAnswers: json.maxAnswers,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      questionText: this.questionText,
      minAnswers: this.minAnswers,
      maxAnswers: this.maxAnswers,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
