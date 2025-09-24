import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class CategoryResponse {
  id: string = '';
  categoryName: string = '';
  description?: string;
  category?: string;
  thumbnail?: FileResourcesResponse;

  constructor(init?: Partial<CategoryResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CategoryResponse {
    return new CategoryResponse({
      id: json.id,
      categoryName: json.categoryName,
      description: json.description,
      category: json.category,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnail: this.thumbnail?.toJson(),
    };
  }
}
