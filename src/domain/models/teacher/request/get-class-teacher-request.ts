export class GetClassTeacherRequest {
  userID?: string;
  status?: string;
  searchText?: string;

  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetClassTeacherRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetClassTeacherRequest {
    return new GetClassTeacherRequest({
      userID: json.userID,
      status: json.status,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      userID: this.userID,
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
