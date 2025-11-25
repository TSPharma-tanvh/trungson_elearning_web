import { QuestionResponse } from './question-response';

export class UserQuizQuestionResponse {
  quizID?: string;
  questionID?: string;
  categoryID?: string;
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
      categoryID: json.categoryID,
      question: json.question ? QuestionResponse.fromJson(json.question) : undefined,
    });
  }

  toJson(): any {
    return {
      quizID: this.quizID,
      questionID: this.questionID,
      categoryID: this.categoryID,
      question: this.question ? this.question.toJson() : undefined,
    };
  }
}
