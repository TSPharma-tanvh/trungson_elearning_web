import {
  type CategoryEnum,
  type LessonContentEnum,
  type LessonTypeEnum,
  type StatusEnum,
} from '@/utils/enum/core-enum';

export class UpdateLessonRequest {
  id!: string;
  courseID?: string;
  name?: string;
  detail?: string;
  enablePlay?: boolean;
  status?: StatusEnum | string;
  lessonType?: LessonTypeEnum | string;
  contentType?: LessonContentEnum | string;
  isRequired?: boolean;
  quizIDs?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;

  // Video
  videoID?: string;
  uploadID?: string;
  videoChunk?: File;
  videoDocumentNo?: string;
  videoPrefixName?: string;
  chunkIndex?: number;
  totalChunks?: number;

  // Lesson resources
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  isFixedLesson?: boolean;

  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;

  startDate?: string;
  endDate?: string;
  fixedLessonDayDuration?: number;

  constructor(init?: Partial<UpdateLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateLessonRequest {
    return new UpdateLessonRequest({
      id: json.id,
      courseID: json.courseID,
      name: json.name,
      detail: json.detail,
      enablePlay: json.enablePlay,
      status: json.status,
      lessonType: json.lessonType,
      contentType: json.contentType,
      isRequired: json.isRequired,
      quizIDs: json.quizIDs,
      categoryID: json.categoryID,
      thumbnailID: json.thumbnailID,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
      categoryEnum: json.categoryEnum,
      videoID: json.videoID,
      uploadID: json.uploadID,
      videoDocumentNo: json.videoDocumentNo,
      videoPrefixName: json.videoPrefixName,
      chunkIndex: json.chunkIndex,
      totalChunks: json.totalChunks,
      resourceIDs: json.resourceIDs,
      resourceDocumentNo: json.resourceDocumentNo,
      resourcePrefixName: json.resourcePrefixName,

      isFixedLesson: json.isFixedLesson,
      positionCode: json.positionCode,
      positionStateCode: json.positionStateCode,
      departmentTypeCode: json.departmentTypeCode,

      startDate: json.startDate,
      endDate: json.endDate,
      fixedLessonDayDuration: json.fixedLessonDayDuration,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      detail: this.detail,
      enablePlay: this.enablePlay,
      status: this.status,
      lessonType: this.lessonType,
      contentType: this.contentType,
      isRequired: this.isRequired,
      quizIDs: this.quizIDs,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
      videoID: this.videoID,
      uploadID: this.uploadID,
      videoDocumentNo: this.videoDocumentNo,
      videoPrefixName: this.videoPrefixName,
      chunkIndex: this.chunkIndex,
      totalChunks: this.totalChunks,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,

      isFixedLesson: this.isFixedLesson,
      positionCode: this.positionCode,
      positionStateCode: this.positionStateCode,
      departmentTypeCode: this.departmentTypeCode,

      startDate: this.startDate,
      endDate: this.endDate,
      fixedLessonDayDuration: this.fixedLessonDayDuration,
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    form.append('Id', this.id);
    if (this.courseID) form.append('CourseID', this.courseID);
    if (this.name) form.append('Name', this.name);
    if (this.detail) form.append('Detail', this.detail);
    if (this.enablePlay !== undefined) form.append('EnablePlay', this.enablePlay.toString());
    if (this.status !== undefined) form.append('Status', this.status.toString());
    if (this.lessonType !== undefined) form.append('LessonType', this.lessonType.toString());
    if (this.contentType !== undefined) form.append('ContentType', this.contentType.toString());
    if (this.isRequired !== undefined) form.append('IsRequired', this.isRequired.toString());
    if (this.quizIDs) form.append('QuizIDs', this.quizIDs);
    if (this.categoryID) form.append('CategoryID', this.categoryID);
    if (this.categoryEnum !== undefined) form.append('CategoryEnum', String(this.categoryEnum));

    // Upload info
    if (this.uploadID) form.append('UploadID', this.uploadID);

    // Thumbnail
    if (this.thumbnailID) form.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail) form.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined)
      form.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());

    // Video
    if (this.videoID) form.append('VideoID', this.videoID);
    if (this.videoChunk) form.append('VideoChunk', this.videoChunk);
    if (this.chunkIndex !== undefined) form.append('ChunkIndex', this.chunkIndex.toString());
    if (this.totalChunks !== undefined) form.append('TotalChunks', this.totalChunks.toString());
    if (this.videoDocumentNo) form.append('VideoDocumentNo', this.videoDocumentNo);
    if (this.videoPrefixName) form.append('VideoPrefixName', this.videoPrefixName);

    // Lesson resources
    if (this.resourceIDs) form.append('ResourceIDs', this.resourceIDs);
    if (this.resourceDocumentNo) form.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) form.append('ResourcePrefixName', this.resourcePrefixName);
    if (this.resources?.length) {
      for (const file of this.resources) {
        form.append('Resources', file);
      }
    }

    if (this.isFixedLesson !== undefined) form.append('IsFixedLesson', String(this.isFixedLesson));
    if (this.positionCode) form.append('PositionCode', this.positionCode);
    if (this.positionStateCode) form.append('PositionStateCode', this.positionStateCode);
    if (this.departmentTypeCode) form.append('DepartmentTypeCode', this.departmentTypeCode);

    if (this.startDate) form.append('StartDate', this.startDate);
    if (this.endDate) form.append('EndDate', this.endDate);
    if (this.fixedLessonDayDuration !== undefined)
      form.append('FixedLessonDayDuration', String(this.fixedLessonDayDuration));

    return form;
  }
}
