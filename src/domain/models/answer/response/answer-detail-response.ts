import { CategoryDetailResponse } from '../../category/response/category-detail-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { QuestionResponse } from '../../question/response/question-response';
import { UserAnswerAnswerRelationDetailResponse } from './user-answer-answer-delation-detail-response';

export class AnswerDetailResponse {
  id?: string;
  questionID?: string;
  answerText?: string;
  isCorrect = false;
  categoryID?: string;
  thumbnailID?: string;
  status?: string;
  category?: CategoryDetailResponse;
  thumbnail?: FileResourcesResponse;
  question?: QuestionResponse;

  constructor(init?: Partial<AnswerDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): AnswerDetailResponse {
    return new AnswerDetailResponse({
      id: json.id,
      questionID: json.questionID,
      answerText: json.answerText,
      isCorrect: json.isCorrect,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      status: json.status,
      category: json.category ? CategoryDetailResponse.fromJson(json.category) : undefined,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      question: json.category ? QuestionResponse.fromJson(json.question) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      questionID: this.questionID,
      answerText: this.answerText,
      isCorrect: this.isCorrect,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      status: this.status,
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      question: this.question,
    };
  }
}
