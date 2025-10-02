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

  static fromJson(json: any): UserAnswerAnswerRelationDetailResponse {
    return new UserAnswerAnswerRelationDetailResponse({
      answerID: json.answerID,
      userAnswerID: json.userAnswerID,
      answer: json.answer ? AnswerResponse.fromJson(json.answer) : undefined,
      userAnswer: json.userAnswer ? UserAnswerResponse.fromJson(json.userAnswer) : undefined,
    });
  }

  toJson(): any {
    return {
      answerID: this.answerID,
      userAnswerID: this.userAnswerID,
      answer: this.answer?.toJson(),
      userAnswer: this.userAnswer?.toJson(),
    };
  }
}
