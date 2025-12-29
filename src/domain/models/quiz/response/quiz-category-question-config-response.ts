import { CategoryDetailResponse } from '../../category/response/category-detail-response';

export class QuizCategoryQuestionConfigResponse {
  id!: string;
  quizID!: string;

  categoryID!: string;
  category!: CategoryDetailResponse;

  displayedQuestionCountFromThisCategory?: number;
  order = 0;

  constructor(init?: Partial<QuizCategoryQuestionConfigResponse>) {
    Object.assign(this, init);

    if (init?.category) {
      this.category = new CategoryDetailResponse(init.category);
    }
  }

  static fromJson(json: any): QuizCategoryQuestionConfigResponse {
    return new QuizCategoryQuestionConfigResponse({
      id: json.id,
      quizID: json.quizID,
      categoryID: json.categoryID,
      category: json.category,
      displayedQuestionCountFromThisCategory: json.displayedQuestionCountFromThisCategory,
      order: json.order ?? 0,
    });
  }

  static fromJsonList(json: any[]): QuizCategoryQuestionConfigResponse[] {
    return json?.map((x) => QuizCategoryQuestionConfigResponse.fromJson(x)) ?? [];
  }

  toJson(): any {
    return {
      id: this.id,
      quizID: this.quizID,
      categoryID: this.categoryID,
      category: this.category?.toJson?.() ?? this.category,
      displayedQuestionCountFromThisCategory: this.displayedQuestionCountFromThisCategory,
      order: this.order,
    };
  }
}
