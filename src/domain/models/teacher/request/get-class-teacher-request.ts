export class GetClassTeacherRequest {
  userID?: string;
  courseID?: string;
  classID?: string;
  classType?: string;
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
      courseID: json.courseID,
      classID: json.classID,
      classType: json.classType,
      status: json.status,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJSON(): any {
    return {
      userID: this.userID,
      courseID: this.courseID,
      classID: this.classID,
      classType: this.classType,
      status: this.status,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
