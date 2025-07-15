import { UserAnswerResponse } from '../../user-answer/response/user-answer-response';
import { AnswerResponse } from './answer-response';

export class UserAnswerAnswerRelationDetailResponse {
  answerID!: string;
  userAnswerID!: string;
  answer?: AnswerResponse;
  userAnswer?: UserAnswerResponse;

  constructor(init?: Partial<UserAnswerAnswerRelationDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserAnswerAnswerRelationDetailResponse {
    return new UserAnswerAnswerRelationDetailResponse({
      answerID: json.answerID,
      userAnswerID: json.userAnswerID,
      answer: json.answer ? AnswerResponse.fromJSON(json.answer) : undefined,
      userAnswer: json.userAnswer ? UserAnswerResponse.fromJSON(json.userAnswer) : undefined,
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
