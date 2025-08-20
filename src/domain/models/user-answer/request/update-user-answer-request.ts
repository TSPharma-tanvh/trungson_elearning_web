export class UpdateUserAnswerRequest {
  id = '';
  isCorrect?: boolean | null;
  score?: number | null;
  answerText?: string | null;

  constructor(init?: Partial<UpdateUserAnswerRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateUserAnswerRequest {
    return new UpdateUserAnswerRequest({
      id: json.id ?? '',
      isCorrect: json.isCorrect ?? null,
      score: json.score ?? null,
      answerText: json.answerText ?? null,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      isCorrect: this.isCorrect,
      score: this.score,
      answerText: this.answerText,
    };
  }
}
