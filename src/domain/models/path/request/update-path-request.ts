import { DisplayTypeEnum, StatusEnum } from '@/utils/enum/path-enum';

export class UpdateCoursePathRequest {
  id: string = '';
  name?: string;
  detail?: string;
  isRequired?: boolean;
  startTime?: string;
  endTime?: string;
  status?: StatusEnum;
  displayType?: DisplayTypeEnum;
  courseIds?: string;
  userIds?: string;
  enrollmentCriteriaID?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  categoryEnum?: string;
  isDeleteOldThumbnail?: boolean;

  constructor(init?: Partial<UpdateCoursePathRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UpdateCoursePathRequest {
    return new UpdateCoursePathRequest({
      id: json.id,
      name: json.name,
      detail: json.detail,
      isRequired: json.isRequired,
      startTime: json.startTime,
      endTime: json.endTime,
      status: json.status,
      displayType: json.displayType,
      courseIds: json.courseIds,
      userIds: json.userIds,
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
      id: this.id,
      name: this.name,
      detail: this.detail,
      isRequired: this.isRequired,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      displayType: this.displayType,
      courseIds: this.courseIds,
      userIds: this.userIds,
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

    if (this.id) formData.append('id', this.id);
    if (this.name) formData.append('name', this.name);
    if (this.detail) formData.append('detail', this.detail);
    if (this.isRequired !== undefined) formData.append('isRequired', String(this.isRequired));
    if (this.startTime) formData.append('startTime', this.startTime);
    if (this.endTime) formData.append('endTime', this.endTime);
    if (this.status !== undefined) formData.append('status', String(this.status));
    if (this.displayType !== undefined) formData.append('displayType', String(this.displayType));
    if (this.courseIds) formData.append('courseIds', this.courseIds);
    if (this.userIds) formData.append('userIds', this.userIds);
    if (this.enrollmentCriteriaID) formData.append('enrollmentCriteriaID', this.enrollmentCriteriaID);
    if (this.categoryID) formData.append('categoryID', this.categoryID);
    if (this.thumbnailID) formData.append('thumbnailID', this.thumbnailID);
    if (this.thumbDocumentNo) formData.append('thumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('thumbPrefixName', this.thumbPrefixName);
    if (this.categoryEnum) formData.append('categoryEnum', this.categoryEnum);
    if (this.isDeleteOldThumbnail !== undefined)
      formData.append('isDeleteOldThumbnail', String(this.isDeleteOldThumbnail));
    if (this.thumbnail) formData.append('thumbnail', this.thumbnail);

    return formData;
  }
}
