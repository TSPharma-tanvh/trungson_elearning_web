import { LessonTypeEnum, type LessonContentEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class GetLessonRequest {
  name?: string;
  courseID?: string;
  status?: StatusEnum;
  lessonType?: LessonTypeEnum;
  contentType?: LessonContentEnum;
  hasCourse?: boolean;
  hasVideo?: boolean;
  hasFileResource?: boolean;
  enablePlay?: boolean;
  isFixedLesson?: boolean;

  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;

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
      hasCourse: json.hasCourse,
      hasVideo: json.hasVideo,
      hasFileResource: json.hasFileResource,
      enablePlay: json.enablePlay,
      isFixedLesson: json.isFixedLesson,

      positionCode: json.positionCode,
      positionStateCode: json.positionStateCode,
      departmentTypeCode: json.departmentTypeCode,

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
      hasCourse: this.hasCourse,
      hasVideo: this.hasVideo,
      hasFileResource: this.hasFileResource,
      enablePlay: this.enablePlay,
      isFixedLesson: this.isFixedLesson,

      positionCode: this.positionCode,
      positionStateCode: this.positionStateCode,
      departmentTypeCode: this.departmentTypeCode,

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

    if (this.hasCourse !== undefined) params['HasCourse'] = this.hasCourse.toString();
    if (this.hasVideo !== undefined) params['HasVideo'] = this.hasVideo.toString();
    if (this.hasFileResource !== undefined) params['HasFileResource'] = this.hasFileResource.toString();
    if (this.enablePlay !== undefined) params['EnablePlay'] = this.enablePlay.toString();
    if (this.isFixedLesson !== undefined) params['IsFixedLesson'] = this.isFixedLesson.toString();

    if (this.positionCode) params['PositionCode'] = this.positionCode;
    if (this.positionStateCode) params['PositionStateCode'] = this.positionStateCode;
    if (this.departmentTypeCode) params['DepartmentTypeCode'] = this.departmentTypeCode;

    if (this.searchText) params['SearchText'] = this.searchText;

    params['PageNumber'] = this.pageNumber.toString();
    params['PageSize'] = this.pageSize.toString();

    return params;
  }
}
