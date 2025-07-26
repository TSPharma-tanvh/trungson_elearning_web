import { type CategoryEnum, type QuestionEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class CreateQuestionRequest {
  questionText?: string;
  questionType?: QuestionEnum;
  point?: number;
  canShuffle = true;

  categoryID?: string;
  answerIDs?: string;
  thumbnailID?: string;
  resourceIDs?: string;
  status?: StatusEnum;

  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;

  isDeleteOldResource?: boolean;
  isDeleteOldThumbnail?: boolean;

  categoryEnum?: CategoryEnum;

  constructor(init?: Partial<CreateQuestionRequest>) {
    Object.assign(this, init);
  }

  toFormData(): FormData {
    const form = new FormData();

    if (this.questionText !== undefined) form.append('QuestionText', this.questionText);
    if (this.questionType !== undefined) form.append('QuestionType', this.questionType.toString());
    if (this.point !== undefined) form.append('Point', this.point.toString());

    form.append('CanShuffle', this.canShuffle.toString());

    if (this.categoryID !== undefined) form.append('CategoryID', this.categoryID);
    if (this.answerIDs !== undefined) form.append('AnswerIDs', this.answerIDs);
    if (this.thumbnailID !== undefined) form.append('ThumbnailID', this.thumbnailID);
    if (this.resourceIDs !== undefined) form.append('ResourceIDs', this.resourceIDs);
    if (this.status !== undefined) form.append('Status', this.status.toString());

    this.resources?.forEach((file) => { form.append('Resources', file); });
    if (this.resourceDocumentNo) form.append('ResourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) form.append('ResourcePrefixName', this.resourcePrefixName);

    if (this.thumbnail) form.append('Thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('ThumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('ThumbPrefixName', this.thumbPrefixName);

    if (this.isDeleteOldResource !== undefined) {
      form.append('IsDeleteOldResource', this.isDeleteOldResource.toString());
    }

    if (this.isDeleteOldThumbnail !== undefined) {
      form.append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }

    if (this.categoryEnum !== undefined) {
      form.append('CategoryEnum', this.categoryEnum.toString());
    }

    return form;
  }
}
