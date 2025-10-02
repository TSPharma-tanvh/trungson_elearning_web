export class AnswerResponse {
  id?: string;
  questionID?: string;
  answerText?: string;
  isCorrect?: boolean;
  categoryID?: string;
  thumbnailID?: string;

  constructor(init?: Partial<AnswerResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AnswerResponse {
    const dto = new AnswerResponse();
    dto.id = json.id;
    dto.questionID = json.questionID;
    dto.answerText = json.answerText;
    dto.isCorrect = json.isCorrect;
    dto.categoryID = json.categoryID;
    dto.thumbnailID = json.thumbnailID;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      questionID: this.questionID,
      answerText: this.answerText,
      isCorrect: this.isCorrect,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
    };
  }
}
