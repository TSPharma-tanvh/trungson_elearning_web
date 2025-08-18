import { AnswerResponse } from '../../answer/response/answer-response';

export class UserAnswerAnswerRelationResponse {
  id?: string;
  answerID!: string;
  userAnswerID!: string;

  answer?: AnswerResponse;

  constructor(init?: Partial<UserAnswerAnswerRelationResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserAnswerAnswerRelationResponse {
    if (!json) {
      throw new Error('Invalid JSON for UserAnswerAnswerRelationResponse');
    }
    return new UserAnswerAnswerRelationResponse({
      id: json.id,
      answerID: json.answerID,
      userAnswerID: json.userAnswerID,
      answer: json.answer ? AnswerResponse.fromJSON(json.answer) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      answerID: this.answerID,
      userAnswerID: this.userAnswerID,
      answer: this.answer ? this.answer.toJSON() : undefined,
    };
  }
}
