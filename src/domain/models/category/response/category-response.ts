import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class CategoryResponse {
  id = '';
  categoryName = '';
  description?: string;
  category?: string;
  thumbnail?: FileResourcesResponse;
  totalScore?: number;

  constructor(init?: Partial<CategoryResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CategoryResponse {
    return new CategoryResponse({
      id: json.id,
      categoryName: json.categoryName,
      description: json.description,
      category: json.category,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      totalScore: json.totalScore,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnail: this.thumbnail?.toJson(),
      totalScore: this.totalScore,
    };
  }
}
