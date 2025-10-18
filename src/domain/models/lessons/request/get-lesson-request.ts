import { type LearningModeEnum, type LessonContentEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class GetLessonRequest {
  name?: string;
  courseID?: string;
  status?: StatusEnum;
  lessonType?: LearningModeEnum;
  contentType?: LessonContentEnum;
  hasVideo?: boolean;
  hasFileResource?: boolean;
  enablePlay?: boolean;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetLessonRequest {
    return new GetLessonRequest({
      name: json.name,
      courseID: json.courseID,
      status: json.status,
      lessonType: json.lessonType,
      contentType: json.contentType,
      hasVideo: json.hasVideo,
      hasFileResource: json.hasFileResource,
      enablePlay: json.enablePlay,
      searchText: json.searchText,
      pageNumber: json.pageNumber ?? 1,
      pageSize: json.pageSize ?? 10,
    });
  }

  toJson(): any {
    return {
      name: this.name,
      courseID: this.courseID,
      status: this.status,
      lessonType: this.lessonType,
      contentType: this.contentType,
      hasVideo: this.hasVideo,
      hasFileResource: this.hasFileResource,
      enablePlay: this.enablePlay,
      searchText: this.searchText,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
  }

  toQueryParams(): Record<string, string> {
    const params: Record<string, string> = {};

    if (this.name) params['Name'] = this.name;
    if (this.courseID) params['CourseID'] = this.courseID;
    if (this.status !== undefined) params['Status'] = this.status.toString();
    if (this.lessonType !== undefined) params['LessonType'] = this.lessonType.toString();
    if (this.contentType !== undefined) params['ContentType'] = this.contentType.toString();
    if (this.hasVideo !== undefined) params['HasVideo'] = this.hasVideo.toString();
    if (this.hasFileResource !== undefined) params['HasFileResource'] = this.hasFileResource.toString();
    if (this.enablePlay !== undefined) params['EnablePlay'] = this.enablePlay.toString();
    if (this.searchText) params['SearchText'] = this.searchText;
    params['PageNumber'] = this.pageNumber.toString();
    params['PageSize'] = this.pageSize.toString();

    return params;
  }
}
