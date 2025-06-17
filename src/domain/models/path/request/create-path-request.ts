export class CreateCoursePathRequest {
  name: string = '';
  detail?: string;
  isRequired: boolean = false;
  startTime: string = '';
  endTime: string = '';
  status?: string;
  displayType?: string;
  courseIds?: string;
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  categoryEnum?: string;
  isDeleteOldThumbnail?: boolean;
  thumbnail?: File;

  constructor(init?: Partial<CreateCoursePathRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateCoursePathRequest {
    return new CreateCoursePathRequest({
      name: json.name,
      detail: json.detail,
      isRequired: json.isRequired,
      startTime: json.startTime,
      endTime: json.endTime,
      status: json.status,
      displayType: json.displayType,
      courseIds: json.courseIds,
      enrollmentCriteriaID: json.enrollmentCriteriaID,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      categoryEnum: json.categoryEnum,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
    });
  }

  toJSON(): any {
    return {
      name: this.name,
      detail: this.detail,
      isRequired: this.isRequired,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      displayType: this.displayType,
      courseIds: this.courseIds,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      categoryEnum: this.categoryEnum,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
    };
  }
}
