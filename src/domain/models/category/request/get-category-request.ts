import { LessonContentEnum } from '@/utils/enum/core-enum';

export class GetCategoryRequest {
  searchText?: string;
  category?: string;
  contentType?: LessonContentEnum;

  createdFrom?: string;
  createdTo?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetCategoryRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetCategoryRequest {
    return new GetCategoryRequest({
      searchText: json.searchText,
      category: json.category,
      contentType: json.contentType,
      createdFrom: json.createdFrom,
      createdTo: json.createdTo,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      searchText: this.searchText,
      category: this.category,
      contentType: this.contentType,
      createdFrom: this.createdFrom,
      createdTo: this.createdTo,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
