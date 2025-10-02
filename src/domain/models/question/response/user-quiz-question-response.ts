import { QuestionResponse } from './question-response';

export class UserQuizQuestionResponse {
  quizID?: string;
  questionID?: string;
  question?: QuestionResponse;

  constructor(init?: Partial<UserQuizQuestionResponse>) {
    Object.assign(this, init);
    if (init?.question) {
      this.question = new QuestionResponse(init.question);
    }
  }

  static fromJson(json: any): UserQuizQuestionResponse {
    return new UserQuizQuestionResponse({
      quizID: json.quizID,
      questionID: json.questionID,
      question: json.question ? QuestionResponse.fromJson(json.question) : undefined,
    });
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      questionID: this.questionID,
      question: this.question ? this.question.toJson() : undefined,
    };
  }
}
