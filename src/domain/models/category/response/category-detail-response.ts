import { type CategoryEnum } from '@/utils/enum/core-enum';

import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { QuestionDetailResponseNoCategoryResponse } from '../../question/response/question-detail-no-category-response';

export class CategoryDetailResponse {
  id?: string;
  categoryName?: string;
  description?: string;
  category?: CategoryEnum;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  questions: QuestionDetailResponseNoCategoryResponse[] = [];
  totalScore?: number;

  constructor(init?: Partial<CategoryDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CategoryDetailResponse {
    return new CategoryDetailResponse({
      id: json.id,
      categoryName: json.categoryName,
      description: json.description,
      category: json.category,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      questions: json.questions
        ? json.questions.map((q: any) => QuestionDetailResponseNoCategoryResponse.fromJson(q))
        : [],
      totalScore: json.totalScore,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      questions: this.questions.map((q) => q.toJson()),
      totalScore: this.totalScore,
    };
  }
}
