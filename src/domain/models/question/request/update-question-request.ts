import { type CategoryEnum, type QuestionEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateQuestionRequest {
  id!: string;

  questionText?: string;
  questionType?: QuestionEnum;
  point?: number;
  canShuffle?: boolean;
  totalAnswer?: number;
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

  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;

  constructor(init?: Partial<UpdateQuestionRequest>) {
    Object.assign(this, init);
  }

  toFormData(): FormData {
    const form = new FormData();
    form.append('id', this.id);

    if (this.questionText) form.append('questionText', this.questionText);
    if (this.questionType !== undefined) form.append('questionType', this.questionType.toString());
    if (this.point !== undefined) form.append('point', this.point.toString());
    if (this.canShuffle !== undefined) form.append('canShuffle', this.canShuffle.toString());
    if (this.totalAnswer !== undefined) form.append('totalAnswer', this.totalAnswer.toString());
    if (this.categoryID) form.append('categoryID', this.categoryID);
    if (this.answerIDs) form.append('answerIDs', this.answerIDs);
    if (this.thumbnailID) form.append('thumbnailID', this.thumbnailID);
    if (this.resourceIDs) form.append('resourceIDs', this.resourceIDs);
    if (this.status !== undefined) form.append('Status', this.status.toString());

    this.resources?.forEach((file) => {
      form.append('resources', file);
    });
    if (this.resourceDocumentNo) form.append('resourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) form.append('resourcePrefixName', this.resourcePrefixName);

    if (this.thumbnail) form.append('thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('thumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('thumbPrefixName', this.thumbPrefixName);

    if (this.isDeleteOldThumbnail !== undefined) {
      form.append('isDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }

    if (this.categoryEnum !== undefined) {
      form.append('categoryEnum', this.categoryEnum.toString());
    }

    return form;
  }
}
