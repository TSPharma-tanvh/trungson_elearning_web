import { LearningModeEnum, StatusEnum, type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateLessonRequest {
  courseID?: string;
  name!: string; // Required
  detail?: string;

  enablePlay!: boolean; // Required
  status!: StatusEnum; // Required
  lessonType!: LearningModeEnum; // Required
  isRequired!: boolean; // Required

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
  videoChunk!: File; // Required
  videoDocumentNo?: string;
  videoPrefixName?: string;
  chunkIndex = 0;
  totalChunks = 0;

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
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    if (this.courseID) form.append('CourseID', this.courseID);
    if (this.name) form.append('Name', this.name);
    if (this.detail) form.append('Detail', this.detail);

    // Required
    form.append('EnablePlay', this.enablePlay.toString());
    form.append('Status', this.status.toString());
    form.append('LessonType', this.lessonType.toString());

    form.append('IsRequired', this.isRequired.toString());

    if (this.quizIDs) form.append('QuizIDs', this.quizIDs);
    if (this.categoryID) form.append('CategoryID', this.categoryID);

    // Thumbnail
    if (this.thumbnailID) form.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail) form.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined) {
      form.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }
    if (this.categoryEnum !== undefined) {
      form.append('CategoryEnum', this.categoryEnum.toString());
    }

    // Video chunk upload (Required)
    if (!this.videoChunk) {
      throw new Error('VideoChunk is required but missing');
    }
    form.append('VideoChunk', this.videoChunk);

    if (this.videoID) form.append('VideoID', this.videoID);
    if (this.uploadID) form.append('UploadID', this.uploadID);
    if (this.videoDocumentNo) form.append('VideoDocumentNo', this.videoDocumentNo);
    if (this.videoPrefixName) form.append('VideoPrefixName', this.videoPrefixName);

    form.append('ChunkIndex', this.chunkIndex.toString());
    form.append('TotalChunks', this.totalChunks.toString());

    return form;
  }
}
