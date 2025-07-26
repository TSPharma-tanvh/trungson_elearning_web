export class GetCategoryRequest {
  searchText?: string;
  category?: string;
  createdFrom?: string;
  createdTo?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetCategoryRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetCategoryRequest {
    return new GetCategoryRequest({
      searchText: json.searchText,
      category: json.category,
      createdFrom: json.createdFrom,
      createdTo: json.createdTo,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      searchText: this.searchText,
      category: this.category,
      createdFrom: this.createdFrom,
      createdTo: this.createdTo,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
