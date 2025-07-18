export class GetUserPathProgressRequest {
  userID?: string;
  pathID?: string;
  progress?: number;
  startDate?: string;
  endDate?: string;
  lastAccess?: string;
  status?: string; //UserProgressEnum
  searchText?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

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
