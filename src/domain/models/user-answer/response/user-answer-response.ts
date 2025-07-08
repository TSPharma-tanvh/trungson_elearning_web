import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class UserAnswerResponse {
  id?: string;
  userID?: string;
  quizID?: string;
  questionID?: string;
  answerID?: string;
  userQuizProgressID?: string;

  answerText?: string;
  answeredAt?: Date;
  sessionID?: string;
  elapsedSeconds?: number;

  thumbnail?: FileResourcesResponse;

  constructor(init?: Partial<UserAnswerResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UserAnswerResponse {
    const dto = new UserAnswerResponse();
    dto.id = json.id;
    dto.userID = json.userID;
    dto.quizID = json.quizID;
    dto.questionID = json.questionID;
    dto.answerID = json.answerID;
    dto.userQuizProgressID = json.userQuizProgressID;
    dto.answerText = json.answerText;
    dto.answeredAt = json.answeredAt ? new Date(json.answeredAt) : undefined;
    dto.sessionID = json.sessionID;
    dto.elapsedSeconds = json.elapsedSeconds;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    return dto;
  }

  toJSON(): any {
    return {
      id: this.id,
      userID: this.userID,
      quizID: this.quizID,
      questionID: this.questionID,
      answerID: this.answerID,
      userQuizProgressID: this.userQuizProgressID,
      answerText: this.answerText,
      answeredAt: this.answeredAt?.toISOString(),
      sessionID: this.sessionID,
      elapsedSeconds: this.elapsedSeconds,
      thumbnail: this.thumbnail?.toJson?.(),
    };
  }
}
