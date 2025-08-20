import { type CategoryEnum, type DisplayTypeEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class CreateCoursePathRequest {
  name?: string;
  detail?: string;
  isRequired?: boolean;
  status?: StatusEnum;
  displayType?: DisplayTypeEnum;
  courseIds?: string;
  enrollmentCriteriaIDs?: string;
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
      status: json.status,
      displayType: json.displayType,
      courseIds: json.courseIds,
      enrollmentCriteriaIDs: json.enrollmentCriteriaIDs,
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
      status: this.status,
      displayType: this.displayType,
      courseIds: this.courseIds,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
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
    if (this.status !== undefined) formData.append('Status', this.status.toString());
    if (this.displayType !== undefined) formData.append('DisplayType', this.displayType.toString());
    if (this.courseIds !== undefined) formData.append('CourseIds', this.courseIds);
    if (this.enrollmentCriteriaIDs !== undefined) formData.append('EnrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
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
