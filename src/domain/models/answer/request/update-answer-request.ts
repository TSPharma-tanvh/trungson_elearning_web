import { StatusEnum } from '@/utils/enum/core-enum';

export class UpdateAnswerRequest {
  id: string = '';
  questionID?: string;
  answerText?: string;
  isCorrect?: boolean;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: string;
  status?: StatusEnum;

  constructor(init?: Partial<UpdateAnswerRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): UpdateAnswerRequest {
    return new UpdateAnswerRequest(json);
  }

  toJSON(): any {
    return {
      id: this.id,
      questionID: this.questionID,
      answerText: this.answerText,
      isCorrect: this.isCorrect,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
      status: this.status != null ? Number(this.status) : undefined,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('Id', this.id);
    if (this.questionID) formData.append('QuestionID', this.questionID);
    if (this.answerText !== undefined) formData.append('AnswerText', this.answerText);
    if (this.isCorrect !== undefined) formData.append('IsCorrect', this.isCorrect.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID !== undefined) formData.append('ThumbnailID', this.thumbnailID ?? '');
    if (this.thumbnail) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined) {
      formData.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }
    if (this.categoryEnum) formData.append('CategoryEnum', this.categoryEnum);
    if (this.status != null) formData.append('Status', String(this.status));
    return formData;
  }
}
