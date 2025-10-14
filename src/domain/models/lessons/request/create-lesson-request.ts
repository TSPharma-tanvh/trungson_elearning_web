import {
  type CategoryEnum,
  type LearningModeEnum,
  type LessonContentEnum,
  type StatusEnum,
} from '@/utils/enum/core-enum';

export class CreateLessonRequest {
  courseID?: string;
  name!: string;
  detail?: string;

  enablePlay!: boolean;
  status!: StatusEnum;
  lessonType!: LearningModeEnum;
  contentType!: LessonContentEnum;
  isRequired!: boolean;

  quizIDs?: string;
  categoryID?: string;

  // Thumbnail
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;

  // Video chunk upload
  videoID?: string;
  uploadID?: string;
  videoChunk!: File;
  videoDocumentNo?: string;
  videoPrefixName?: string;
  chunkIndex = 0;
  totalChunks = 0;

  // Resources
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  constructor(init?: Partial<CreateLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateLessonRequest {
    return new CreateLessonRequest({
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
    });
  }

  toJson(): any {
    return {
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
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    if (this.courseID) form.append('CourseID', this.courseID);
    if (this.name) form.append('Name', this.name);
    if (this.detail) form.append('Detail', this.detail);

    form.append('EnablePlay', this.enablePlay.toString());
    form.append('Status', this.status.toString());
    form.append('LessonType', this.lessonType.toString());
    form.append('ContentType', this.contentType.toString());
    form.append('IsRequired', this.isRequired.toString());

    if (this.quizIDs) form.append('QuizIDs', this.quizIDs);
    if (this.categoryID) form.append('CategoryID', this.categoryID);

    // Thumbnail
    if (this.thumbnailID) form.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail) form.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined)
      form.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    if (this.categoryEnum !== undefined) form.append('CategoryEnum', this.categoryEnum.toString());

    // Video (Required)
    form.append('VideoChunk', this.videoChunk);

    if (this.videoID) form.append('VideoID', this.videoID);
    if (this.uploadID) form.append('UploadID', this.uploadID);
    if (this.videoDocumentNo) form.append('VideoDocumentNo', this.videoDocumentNo);
    if (this.videoPrefixName) form.append('VideoPrefixName', this.videoPrefixName);
    form.append('ChunkIndex', this.chunkIndex.toString());
    form.append('TotalChunks', this.totalChunks.toString());

    // Resources
    if (this.resourceIDs) form.append('ResourceIDs', this.resourceIDs);
    if (this.resources && this.resources.length > 0) {
      this.resources.forEach((file) => form.append('Resources', file));
    }
    if (this.resourceDocumentNo) form.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) form.append('ResourcePrefixName', this.resourcePrefixName);

    return form;
  }
}
