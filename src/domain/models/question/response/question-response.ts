import { AnswerResponse } from '../../answer/response/answer-response';
import { CategoryResponse } from '../../category/response/category-response';
import { FileQuestionRelationResponse } from '../../file/response/file-question-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class QuestionResponse {
  id!: string;
  questionText = '';
  questionType!: string;
  point!: number;
  canShuffle!: boolean;
  totalAnswer?: number;
  status?: string;
  categoryId?: string;
  category?: CategoryResponse;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  fileQuestionRelation: FileQuestionRelationResponse[] = [];
  answers: AnswerResponse[] = [];

  constructor(init?: Partial<QuestionResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuestionResponse {
    const dto = new QuestionResponse();
    dto.id = json.id;
    dto.questionText = json.questionText;
    dto.questionType = json.questionType;
    dto.point = json.point;
    dto.canShuffle = json.canShuffle;
    dto.totalAnswer = json.totalAnswer;
    dto.status = json.status;
    dto.categoryId = json.categoryId;
    dto.thumbnailId = json.thumbnailId;

    dto.category = json.category ? CategoryResponse.fromJson(json.category) : undefined;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.fileQuestionRelation =
      json.fileQuestionRelation?.map((f: any) => FileQuestionRelationResponse.fromJson(f)) ?? [];
    dto.answers = json.answers?.map((a: any) => AnswerResponse.fromJson(a)) ?? [];

    return dto;
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
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      fileQuestionRelation: this.fileQuestionRelation.map((f) => f.toJson()),
      answers: this.answers.map((a) => a.toJson()),
    };
  }
}
