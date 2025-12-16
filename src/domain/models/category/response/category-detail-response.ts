import { type CategoryEnum } from '@/utils/enum/core-enum';

import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { QuestionDetailResponseNoCategoryResponse } from '../../question/response/question-detail-no-category-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class CategoryDetailResponse {
  id?: string;
  categoryName?: string;
  description?: string;
  category?: CategoryEnum;

  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;

  questions: QuestionDetailResponseNoCategoryResponse[] = [];
  fileResources: FileResourcesResponse[] = [];

  totalScore?: number;

  createdByUser?: UserDetailResponse;
  updatedByUser?: UserDetailResponse;

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

      fileResources: json.fileResources ? json.fileResources.map((f: any) => FileResourcesResponse.fromJson(f)) : [],

      totalScore: json.totalScore,

      createdByUser: json.createdByUser ? UserDetailResponse.fromJson(json.createdByUser) : undefined,

      updatedByUser: json.updatedByUser ? UserDetailResponse.fromJson(json.updatedByUser) : undefined,
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
      fileResources: this.fileResources.map((f) => f.toJson()),

      totalScore: this.totalScore,

      createdByUser: this.createdByUser?.toJson(),
      updatedByUser: this.updatedByUser?.toJson(),
    };
  }
}
