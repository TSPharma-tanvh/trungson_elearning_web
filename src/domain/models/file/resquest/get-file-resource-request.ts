import { type StatusEnum } from '@/utils/enum/core-enum';

export class GetFileResourcesRequest {
  type?: string; // corresponds to FileTypeEnum (as string)
  status?: StatusEnum;
  categoryID?: string;
  isQRCode?: boolean;
  hasClass?: boolean;
  hasCourse?: boolean;
  hasLesson?: boolean;
  hasQuestion?: boolean;
  hasQuiz?: boolean;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetFileResourcesRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetFileResourcesRequest {
    return new GetFileResourcesRequest({
      type: json.type,
      status: json.status,
      categoryID: json.categoryID,
      isQRCode: json.isQRCode,
      hasClass: json.hasClass,
      hasCourse: json.hasCourse,
      hasLesson: json.hasLesson,
      hasQuestion: json.hasQuestion,
      hasQuiz: json.hasQuiz,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      type: this.type,
      status: this.status,
      categoryID: this.categoryID,
      isQRCode: this.isQRCode,
      hasClass: this.hasClass,
      hasCourse: this.hasCourse,
      hasLesson: this.hasLesson,
      hasQuestion: this.hasQuestion,
      hasQuiz: this.hasQuiz,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }
}
