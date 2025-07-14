import { AnswerDetailResponse } from './answer-detail-response';
import { UserAnswerResponseDetail as UserAnswerDetailResponse } from './user-answer-detail-response';

export class UserAnswerAnswerRelationDetailResponse {
  answerID!: string;
  userAnswerID!: string;
  answer?: AnswerDetailResponse;
  userAnswer?: UserAnswerDetailResponse;

  constructor(init?: Partial<UserAnswerAnswerRelationDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserAnswerAnswerRelationDetailResponse {
    return new UserAnswerAnswerRelationDetailResponse({
      answerID: json.answerID,
      userAnswerID: json.userAnswerID,
      answer: json.answer ? AnswerDetailResponse.fromJSON(json.answer) : undefined,
      userAnswer: json.userAnswer ? UserAnswerDetailResponse.fromJSON(json.userAnswer) : undefined,
    });
  }

  toJSON(): any {
    return {
      answerID: this.answerID,
      userAnswerID: this.userAnswerID,
      answer: this.answer?.toJSON(),
      userAnswer: this.userAnswer?.toJSON(),
    };
  }
}
