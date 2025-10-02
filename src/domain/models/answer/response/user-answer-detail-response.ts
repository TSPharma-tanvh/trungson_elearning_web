import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { UserAnswerAnswerRelationDetailResponse } from './user-answer-answer-delation-detail-response';

export class UserAnswerResponseDetail {
  id?: string;
  userID?: string;
  quizID?: string;
  questionID?: string;
  answerID?: string;
  userQuizProgressID?: string;
  isCorrect?: boolean;
  answerText?: string;
  answeredAt?: Date;
  sessionID?: string;
  elapsedSeconds?: number;
  thumbnail?: FileResourcesResponse;
  selectedAnswers: UserAnswerAnswerRelationDetailResponse[] = [];

  constructor(init?: Partial<UserAnswerResponseDetail>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UserAnswerResponseDetail {
    return new UserAnswerResponseDetail({
      id: json.id,
      userID: json.userID,
      quizID: json.quizID,
      questionID: json.questionID,
      answerID: json.answerID,
      userQuizProgressID: json.userQuizProgressID,
      isCorrect: json.isCorrect,
      answerText: json.answerText,
      answeredAt: json.answeredAt ? new Date(json.answeredAt) : undefined,
      sessionID: json.sessionID,
      elapsedSeconds: json.elapsedSeconds,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      selectedAnswers: json.selectedAnswers?.map((x: any) => UserAnswerAnswerRelationDetailResponse.fromJson(x)) ?? [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      userID: this.userID,
      quizID: this.quizID,
      questionID: this.questionID,
      answerID: this.answerID,
      userQuizProgressID: this.userQuizProgressID,
      isCorrect: this.isCorrect,
      answerText: this.answerText,
      answeredAt: this.answeredAt?.toISOString(),
      sessionID: this.sessionID,
      elapsedSeconds: this.elapsedSeconds,
      thumbnail: this.thumbnail?.toJson(),
      selectedAnswers: this.selectedAnswers.map((x) => x.toJson()),
    };
  }
}
