import { type CategoryEnum, LearningModeEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateLessonRequest {
  courseID?: string;
  name?: string;
  detail?: string;
  enablePlay = true;
  status: StatusEnum = StatusEnum.Enable;
  lessonType: LearningModeEnum = LearningModeEnum.Online;
  quizIDs?: string;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;

  video!: File;
  videoDocumentNo?: string;
  videoPrefixName?: string;

  constructor(init?: Partial<CreateLessonRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateLessonRequest {
    return new CreateLessonRequest({
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
      videoDocumentNo: json.videoDocumentNo,
      videoPrefixName: json.videoPrefixName,
    });
  }

  toJSON(): any {
    return {
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
      videoDocumentNo: this.videoDocumentNo,
      videoPrefixName: this.videoPrefixName,
    };
  }

  toFormData(): FormData {
    const form = new FormData();

    if (this.courseID) form.append('CourseID', this.courseID);
    if (this.name) form.append('Name', this.name);
    if (this.detail) form.append('Detail', this.detail);

    form.append('EnablePlay', this.enablePlay?.toString() ?? 'true');
    if (this.status !== undefined) form.append('Status', this.status.toString());
    if (this.lessonType !== undefined) form.append('LessonType', this.lessonType.toString());

    if (this.quizIDs) form.append('QuizIDs', this.quizIDs);
    if (this.categoryID) form.append('CategoryID', this.categoryID);
    if (this.thumbnailID) form.append('ThumbnailID', this.thumbnailID);
    if (this.thumbnail) form.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined)
      form.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    if (this.categoryEnum !== undefined) form.append('CategoryEnum', this.categoryEnum.toString());

    //Check required field video
    if (!this.video) {
      throw new Error('Video is required but missing');
    }
    form.append('Video', this.video);

    if (this.videoDocumentNo) form.append('VideoDocumentNo', this.videoDocumentNo);
    if (this.videoPrefixName) form.append('VideoPrefixName', this.videoPrefixName);

    return form;
  }
}
