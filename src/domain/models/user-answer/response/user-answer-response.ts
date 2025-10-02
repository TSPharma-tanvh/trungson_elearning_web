import { QuestionResponse } from '../../question/response/question-response';
import { UserAnswerAnswerRelationResponse } from './user-answer-answer-relation-response';

export class UserAnswerResponse {
  id?: string;
  userID?: string;
  quizID?: string;
  questionID?: string;
  userQuizProgressID?: string;

  answerText?: string;
  answeredAt?: Date;
  isCorrect?: boolean;
  score?: number;

  sessionID?: string;
  elapsedSeconds?: number;

  question?: QuestionResponse;
  selectedAnswers: UserAnswerAnswerRelationResponse[] = [];

  constructor(init?: Partial<UserAnswerResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserAnswerResponse {
    if (!json) {
      throw new Error('Invalid JSON for UserAnswerResponse');
    }
    return new UserAnswerResponse({
      id: json.id,
      userID: json.userID,
      quizID: json.quizID,
      questionID: json.questionID,
      userQuizProgressID: json.userQuizProgressID,
      answerText: json.answerText,
      answeredAt: json.answeredAt ? new Date(json.answeredAt) : undefined,
      isCorrect: json.isCorrect,
      score: json.score,
      sessionID: json.sessionID,
      elapsedSeconds: json.elapsedSeconds,
      question: json.question ? QuestionResponse.fromJson(json.question) : undefined,
      selectedAnswers: json.selectedAnswers
        ? json.selectedAnswers.map((sa: any) => UserAnswerAnswerRelationResponse.fromJson(sa))
        : [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      quizID: this.quizID,
      questionID: this.questionID,
      userQuizProgressID: this.userQuizProgressID,
      answerText: this.answerText,
      answeredAt: this.answeredAt?.toISOString(),
      isCorrect: this.isCorrect,
      score: this.score,
      sessionID: this.sessionID,
      elapsedSeconds: this.elapsedSeconds,
      question: this.question ? this.question.toJson() : undefined,
      selectedAnswers: this.selectedAnswers ? this.selectedAnswers.map((sa) => sa.toJson()) : [],
    };
  }
}
