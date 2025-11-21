import { AnswerResponse } from '../../answer/response/answer-response';
import { FileQuestionRelationResponse } from '../../file/response/file-question-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class QuestionDetailResponseNoCategoryResponse {
  id = '';
  questionText = '';
  questionType?: string;
  point = 0;
  canShuffle = false;
  totalAnswer?: number;
  status?: string;
  categoryId?: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  fileQuestionRelation: FileQuestionRelationResponse[] = [];
  answers: AnswerResponse[] = [];

  constructor(init?: Partial<QuestionDetailResponseNoCategoryResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuestionDetailResponseNoCategoryResponse {
    return new QuestionDetailResponseNoCategoryResponse({
      id: json.id,
      questionText: json.questionText,
      questionType: json.questionType,
      point: json.point,
      canShuffle: json.canShuffle,
      totalAnswer: json.totalAnswer,
      status: json.status,
      categoryId: json.categoryId,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileQuestionRelation: json.fileQuestionRelation
        ? json.fileQuestionRelation.map((f: any) => FileQuestionRelationResponse.fromJson(f))
        : [],
      answers: json.answers ? json.answers.map((a: any) => AnswerResponse.fromJson(a)) : [],
    });
  }

  toJson(): any {
    return {
      id: this.id,
      questionText: this.questionText,
      questionType: this.questionType,
      point: this.point,
      canShuffle: this.canShuffle,
      totalAnswer: this.totalAnswer,
      status: this.status,
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      fileQuestionRelation: this.fileQuestionRelation.map((f) => f.toJson()),
      answers: this.answers.map((a) => a.toJson()),
    };
  }
}
