import { QuestionResponse } from '../../question/response/question-response';

export class FileQuestionRelationResponseForResource {
  id?: string;
  questionId?: string;
  fileResourceId?: string;
  question?: QuestionResponse;

  constructor(init?: Partial<FileQuestionRelationResponseForResource>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileQuestionRelationResponseForResource {
    if (!json) return new FileQuestionRelationResponseForResource();
    return new FileQuestionRelationResponseForResource({
      id: json.id,
      questionId: json.questionId,
      fileResourceId: json.fileResourceId,
      question: json.question ? QuestionResponse.fromJson(json.question) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      questionId: this.questionId,
      fileResourceId: this.fileResourceId,
      question: this.question?.toJson(),
    };
  }
}
