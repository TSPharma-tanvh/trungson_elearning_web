export class GetUserPathProgressRequest {
  userID?: string;
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

  static fromJSON(data: any): GetUserPathProgressRequest {
    return new GetUserPathProgressRequest(data);
  }

  toJSON(): any {
    return { ...this };
  }
}
