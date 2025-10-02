export class UserQuestionResponse {
  id?: string;
  questionText?: string;
  questionType?: string;
  point?: number;
  canShuffle?: boolean;
  totalAnswer?: number;
  status?: string;

  constructor(init?: Partial<UserQuestionResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserQuestionResponse {
    return new UserQuestionResponse({
      id: json.id,
      questionText: json.questionText,
      questionType: json.questionType,
      point: json.point,
      canShuffle: json.canShuffle,
      totalAnswer: json.totalAnswer,
      status: json.status,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      questionText: this.questionText,
      questionType: this.questionType,
      point: this.point,
      canShuffle: this.canShuffle,
      totalAnswer: this.totalAnswer,
      status: this.status,
    };
  }
}
