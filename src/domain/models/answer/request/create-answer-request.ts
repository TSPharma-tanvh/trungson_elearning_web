import { type CategoryEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class CreateAnswerRequest {
  questionID?: string;
  answerText = '';
  isCorrect = false;
  categoryID?: string;
  thumbnailID?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;
  status?: StatusEnum;

  constructor(init?: Partial<CreateAnswerRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateAnswerRequest {
    return new CreateAnswerRequest(json);
  }

  toJSON(): any {
    return {
      questionID: this.questionID,
      answerText: this.answerText,
      isCorrect: this.isCorrect,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
      status: this.status !== undefined ? Number(this.status) : undefined,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    if (this.questionID) formData.append('QuestionID', this.questionID);
    formData.append('AnswerText', this.answerText);
    formData.append('IsCorrect', this.isCorrect.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.thumbnailID !== undefined) formData.append('ThumbnailID', this.thumbnailID ?? '');
    if (this.thumbnail) formData.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) formData.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) formData.append('ThumbPrefixName', this.thumbPrefixName);
    if (this.isDeleteOldThumbnail !== undefined) {
      formData.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }
    if (this.categoryEnum !== undefined) {
      formData.append('CategoryEnum', this.categoryEnum.toString());
    }
    if (this.status !== undefined) formData.append('Status', String(this.status));
    return formData;
  }
}
