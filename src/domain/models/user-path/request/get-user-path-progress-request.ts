export class GetUserPathProgressRequest {
  userID?: string;
  enrollmentCriteriaId?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status?: string; //UserProgressEnum
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetUserPathProgressRequest>) {
    Object.assign(this, init);
  }

  static fromJson(data: any): GetUserPathProgressRequest {
    return new GetUserPathProgressRequest(data);
  }

  toJson(): any {
    return { ...this };
  }
}
