import { LessonsCollectionUpdateRequest } from '../../lessons/request/lesson-collection-update-request';

export class UpdateCourseRequest {
  id!: string;
  pathId?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: string;

  positionStateCode?: string;

  isFixedCourse!: boolean;
  teacherId?: string;
  courseType?: string;
  displayType?: string;
  meetingLink?: string;

  collections: LessonsCollectionUpdateRequest[] = [];

  categoryId?: string;
  thumbnailId?: string;

  resourceIds?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;

  isDeleteOldThumbnail?: boolean;
  categoryEnum?: string;

  departmentTypeCode?: string;
  positionCode?: string;

  constructor(init?: Partial<UpdateCourseRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateCourseRequest {
    return new UpdateCourseRequest({
      id: json.id,
      pathId: json.pathId,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,

      positionStateCode: json.positionStateCode,

      isFixedCourse: json.isFixedCourse,
      teacherId: json.teacherId,
      courseType: json.courseType,
      displayType: json.displayType,
      meetingLink: json.meetingLink,

      collections: json.collections?.map((c: any) => LessonsCollectionUpdateRequest.fromJson(c)) ?? [],

      categoryId: json.categoryId,
      thumbnailId: json.thumbnailId,

      resourceIds: json.resourceIds,
      resourceDocumentNo: json.resourceDocumentNo,
      resourcePrefixName: json.resourcePrefixName,

      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
      categoryEnum: json.categoryEnum,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      pathId: this.pathId,
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,

      positionStateCode: this.positionStateCode,

      isFixedCourse: this.isFixedCourse,
      teacherId: this.teacherId,
      courseType: this.courseType,
      displayType: this.displayType,
      meetingLink: this.meetingLink,

      collections: this.collections.map((c) => c.toJson()),

      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,

      resourceIds: this.resourceIds,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,

      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
    };
  }

  /**
   * Converts to FormData that .NET can correctly parse.
   */
  toFormData(): FormData {
    const fd = new FormData();

    fd.append('Id', this.id);
    if (this.pathId) fd.append('PathID', this.pathId);
    if (this.detail) fd.append('Detail', this.detail);
    if (this.isRequired !== null) fd.append('IsRequired', String(this.isRequired));
    if (this.name) fd.append('Name', this.name);
    if (this.disableStatus) fd.append('DisableStatus', this.disableStatus);

    if (this.positionStateCode) fd.append('PositionStateCode', this.positionStateCode);

    fd.append('IsFixedCourse', String(this.isFixedCourse));

    if (this.teacherId) fd.append('TeacherID', this.teacherId);
    if (this.courseType) fd.append('CourseType', this.courseType);
    if (this.displayType) fd.append('DisplayType', this.displayType);
    if (this.meetingLink) fd.append('MeetingLink', this.meetingLink);

    // Collections → must be JSON string
    if (this.collections && this.collections.length > 0) {
      fd.append(
        'Collections',
        JSON.stringify(
          this.collections.map((c) => ({
            Id: c.id,
            Name: c.name,
            Order: c.order,
            StartDate: c.startDate ? c.startDate.toISOString() : undefined,
            EndDate: c.endDate ? c.endDate.toISOString() : undefined,
            FixedCourseDayDuration: c.fixedCourseDayDuration,
            Collection: c.collection.map((item) => ({
              LessonId: item.lessonId,
              Order: item.order,
            })),
          }))
        )
      );
    }

    if (this.categoryId) fd.append('CategoryID', this.categoryId);
    if (this.thumbnailId) fd.append('ThumbnailID', this.thumbnailId);

    if (this.resourceIds) fd.append('ResourceIDs', this.resourceIds);

    if (this.resources) {
      this.resources.forEach((file) => {
        fd.append('Resources', file);
      });
    }

    if (this.resourceDocumentNo) fd.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) fd.append('ResourcePrefixName', this.resourcePrefixName);

    if (this.thumbnail) fd.append('Thumbnail', this.thumbnail);

    if (this.thumbDocumentNo) fd.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) fd.append('ThumbPrefixName', this.thumbPrefixName);

    if (this.isDeleteOldThumbnail !== null) {
      fd.append('IsDeleteOldThumbnail', String(this.isDeleteOldThumbnail));
    }

    if (this.categoryEnum) fd.append('CategoryEnum', this.categoryEnum);
    if (this.departmentTypeCode) fd.append('DepartmentTypeCode', this.departmentTypeCode);
    if (this.positionCode) fd.append('PositionCode', this.positionCode);
    return fd;
  }
}
