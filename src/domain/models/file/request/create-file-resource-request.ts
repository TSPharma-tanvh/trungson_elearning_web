import { StatusEnum, type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateFileResourcesRequest {
  files?: File[];
  documentNo?: string;
  prefixName?: string;
  status: StatusEnum = StatusEnum.Enable;
  categoryID?: string;
  categoryEnum?: CategoryEnum;
  userID?: string;
  classID?: string;
  courseID?: string;
  lessonID?: string;
  quizID?: string;
  questionID?: string;
  videoID?: string;
  uploadID?: string;
  videoChunk?: File;
  videoDocumentNo?: string;
  videoPrefixName?: string;
  chunkIndex?: number;
  totalChunks?: number;

  constructor(data?: Partial<CreateFileResourcesRequest>) {
    Object.assign(this, data);
  }

  static fromJson(json: any): CreateFileResourcesRequest {
    return new CreateFileResourcesRequest({
      files: json.files || [],
      documentNo: json.documentNo,
      prefixName: json.prefixName,
      status: json.status ?? StatusEnum.Enable,
      categoryID: json.categoryID,
      categoryEnum: json.categoryEnum,
      userID: json.userID,
      classID: json.classID,
      courseID: json.courseID,
      lessonID: json.lessonID,
      quizID: json.quizID,
      questionID: json.questionID,
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
      documentNo: this.documentNo,
      prefixName: this.prefixName,
      status: this.status,
      categoryID: this.categoryID,
      categoryEnum: this.categoryEnum,
      userID: this.userID,
      classID: this.classID,
      courseID: this.courseID,
      lessonID: this.lessonID,
      quizID: this.quizID,
      questionID: this.questionID,
      videoID: this.videoID,
      uploadID: this.uploadID,
      videoDocumentNo: this.videoDocumentNo,
      videoPrefixName: this.videoPrefixName,
      chunkIndex: this.chunkIndex,
      totalChunks: this.totalChunks,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    // append files
    this.files?.forEach((f) => {
      formData.append('Files', f);
    });

    // append video chunk
    if (this.videoChunk) formData.append('VideoChunk', this.videoChunk);

    // append optional fields
    if (this.documentNo) formData.append('DocumentNo', this.documentNo);
    if (this.prefixName) formData.append('PrefixName', this.prefixName);
    formData.append('Status', this.status.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());
    if (this.userID) formData.append('UserID', this.userID);
    if (this.classID) formData.append('ClassID', this.classID);
    if (this.courseID) formData.append('CourseID', this.courseID);
    if (this.lessonID) formData.append('LessonID', this.lessonID);
    if (this.quizID) formData.append('QuizID', this.quizID);
    if (this.questionID) formData.append('QuestionID', this.questionID);
    if (this.videoID) formData.append('VideoID', this.videoID);
    if (this.uploadID) formData.append('UploadID', this.uploadID);
    if (this.videoDocumentNo) formData.append('VideoDocumentNo', this.videoDocumentNo);
    if (this.videoPrefixName) formData.append('VideoPrefixName', this.videoPrefixName);
    if (this.chunkIndex !== undefined) formData.append('ChunkIndex', this.chunkIndex.toString());
    if (this.totalChunks !== undefined) formData.append('TotalChunks', this.totalChunks.toString());

    return formData;
  }
}
