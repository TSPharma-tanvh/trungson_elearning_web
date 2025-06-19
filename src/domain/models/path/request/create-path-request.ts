import { CategoryEnum, DisplayTypeEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateCoursePathRequest {
  name?: string;
  detail?: string;
  isRequired?: boolean;
  startTime?: string;
  endTime?: string;
  status?: StatusEnum;
  displayType?: DisplayTypeEnum;
  courseIds?: string;
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  categoryEnum?: CategoryEnum;
  isDeleteOldThumbnail?: boolean;

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

  toFormData(): FormData {
    const formData = new FormData();

    if (this.name !== undefined) formData.append('Name', this.name);
    if (this.detail !== undefined) formData.append('Detail', this.detail);
    if (this.isRequired !== undefined) formData.append('IsRequired', this.isRequired.toString());
    if (this.startTime !== undefined) formData.append('StartTime', this.startTime);
    if (this.endTime !== undefined) formData.append('EndTime', this.endTime);
    if (this.status !== undefined) formData.append('Status', this.status.toString());
    if (this.displayType !== undefined) formData.append('DisplayType', this.displayType.toString());
    if (this.courseIds !== undefined) formData.append('CourseIds', this.courseIds);
    if (this.enrollmentCriteriaID !== undefined) formData.append('EnrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.categoryID !== undefined) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID !== undefined) formData.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail !== undefined) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo !== undefined) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName !== undefined) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());
    if (this.isDeleteOldThumbnail !== undefined)
      formData.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());

    return formData;
  }
}
