import { QuestionEnum } from '@/utils/enum/core-enum';

import { AnswerResponse } from '../../answer/response/answer-response';
import { CategoryResponse } from '../../category/response/category-response';
import { FileQuestionRelationResponse } from '../../file/response/file-question-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class QuestionResponse {
  id!: string;
  questionText: string = '';
  questionType!: QuestionEnum;
  point!: number;
  canShuffle!: boolean;
  totalAnswer?: number;
  categoryId?: string;
  category?: CategoryResponse;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  fileQuestionRelation: FileQuestionRelationResponse[] = [];
  answers: AnswerResponse[] = [];

  constructor(init?: Partial<QuestionResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): QuestionResponse {
    const dto = new QuestionResponse();
    dto.id = json.id;
    dto.questionText = json.questionText;
    dto.questionType = json.questionType;
    dto.point = json.point;
    dto.canShuffle = json.canShuffle;
    dto.totalAnswer = json.totalAnswer;
    dto.categoryId = json.categoryId;
    dto.thumbnailId = json.thumbnailId;
    dto.category = json.category ? CategoryResponse.fromJSON(json.category) : undefined;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.fileQuestionRelation =
      json.fileQuestionRelation?.map((f: any) => FileQuestionRelationResponse.fromJSON(f)) ?? [];
    dto.answers = json.answers?.map((a: any) => AnswerResponse.fromJSON(a)) ?? [];
    return dto;
  }

  toJSON(): any {
    return {
      id: this.id,
      questionText: this.questionText,
      questionType: this.questionType,
      point: this.point,
      canShuffle: this.canShuffle,
      totalAnswer: this.totalAnswer,
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
      category: this.category?.toJSON(),
      thumbnail: this.thumbnail?.toJson(),
      fileQuestionRelation: this.fileQuestionRelation.map((f) => f.toJSON()),
      answers: this.answers.map((a) => a.toJSON()),
    };
  }
}
