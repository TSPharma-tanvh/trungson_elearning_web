import { type CategoryEnum, type LearningModeEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateLessonRequest {
  id!: string;
  courseID?: string;
  name?: string;
  detail?: string;
  enablePlay?: boolean;
  status?: StatusEnum;
  lessonType?: LearningModeEnum;
  quizIDs?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;
  videoChunk?: File; // Changed from video to videoChunk
  videoID?: string;
  uploadID?: string;
  videoDocumentNo?: string;
  videoPrefixName?: string;
  isRequired?: boolean;
  chunkIndex?: number; // Added
  totalChunks?: number; // Added

  constructor(init?: Partial<UpdateLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UpdateLessonRequest {
    return new UpdateLessonRequest({
      id: json.id,
      courseID: json.courseID,
      name: json.name,
      detail: json.detail,
      enablePlay: json.enablePlay,
      status: json.status,
      lessonType: json.lessonType,
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
      isRequired: json.isRequired,
      chunkIndex: json.chunkIndex,
      totalChunks: json.totalChunks,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      courseID: this.courseID,
      name: this.name,
      detail: this.detail,
      enablePlay: this.enablePlay,
      status: this.status,
      lessonType: this.lessonType,
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
      isRequired: this.isRequired,
      chunkIndex: this.chunkIndex,
      totalChunks: this.totalChunks,
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
    form.append('UploadID', this.uploadID ?? '');
    // Video
    if (this.videoChunk) {
      form.append('VideoChunk', this.videoChunk);
      if (this.chunkIndex !== undefined) form.append('ChunkIndex', this.chunkIndex.toString());
      if (this.totalChunks !== undefined) form.append('TotalChunks', this.totalChunks.toString());
      if (this.videoDocumentNo) form.append('VideoDocumentNo', this.videoDocumentNo);
      if (this.videoPrefixName) form.append('VideoPrefixName', this.videoPrefixName);
    } else if (this.videoID) {
      // Nếu không upload chunk => chỉ gửi videoID
      form.append('VideoID', this.videoID);
    }

    if (this.isRequired !== undefined) form.append('IsRequired', this.isRequired.toString());

    return form;
  }
}
