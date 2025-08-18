import { StatusEnum } from '@/utils/enum/core-enum';

export class GetUserQuizLiveStatusRequest {
  quizId?: string;
  enrollmentCriteriaId?: string;
  activeStatus?: StatusEnum;
  searchText?: string;
  pageNumber: number = 1;
  pageSize: number = 10;

  constructor(init?: Partial<GetUserQuizLiveStatusRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetUserQuizLiveStatusRequest {
    if (!json) {
      throw new Error('Invalid JSON for GetUserQuizLiveStatusRequest');
    }
    return new GetUserQuizLiveStatusRequest({
      quizId: json.quizId,
      enrollmentCriteriaId: json.enrollmentCriteriaId,
      activeStatus: json.activeStatus !== undefined ? (json.activeStatus as StatusEnum) : undefined,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      quizId: this.quizId,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      activeStatus: this.activeStatus,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
