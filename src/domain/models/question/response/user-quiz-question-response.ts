import { UserQuestionResponse } from './user-question-response';

export class UserQuizQuestionResponse {
  quizID?: string;
  questionID?: string;
  question?: UserQuestionResponse;

  constructor(init?: Partial<UserQuizQuestionResponse>) {
    Object.assign(this, init);
    if (init?.question) {
      this.question = new UserQuestionResponse(init.question);
    }
  }

  static fromJSON(json: any): UserQuizQuestionResponse {
    return new UserQuizQuestionResponse({
      quizID: json.quizID,
      questionID: json.questionID,
      question: json.question ? UserQuestionResponse.fromJSON(json.question) : undefined,
    });
  }

  toJSON(): any {
    return {
      quizID: this.quizID,
      questionID: this.questionID,
      question: this.question ? this.question.toJSON() : undefined,
    };
  }
}
