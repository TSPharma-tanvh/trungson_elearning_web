import { CategoryEnum, QuestionEnum } from '@/utils/enum/core-enum';

export class CreateQuestionRequest {
  questionText!: string;
  questionType!: QuestionEnum;
  point!: number;
  canShuffle: boolean = true;

  categoryID!: string;
  answerIDs?: string;
  thumbnailID?: string;
  resourceIDs?: string;

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
    form.append('questionText', this.questionText);
    form.append('questionType', this.questionType.toString());
    form.append('point', this.point.toString());
    form.append('canShuffle', this.canShuffle.toString());

    form.append('categoryID', this.categoryID);
    if (this.answerIDs) form.append('answerIDs', this.answerIDs);
    if (this.thumbnailID) form.append('thumbnailID', this.thumbnailID);
    if (this.resourceIDs) form.append('resourceIDs', this.resourceIDs);

    this.resources?.forEach((file) => form.append('resources', file));
    if (this.resourceDocumentNo) form.append('resourceDocumentNo', this.resourceDocumentNo);
    if (this.resourcePrefixName) form.append('resourcePrefixName', this.resourcePrefixName);

    if (this.thumbnail) form.append('thumbnail', this.thumbnail);
    if (this.thumbDocumentNo) form.append('thumbDocumentNo', this.thumbDocumentNo);
    if (this.thumbPrefixName) form.append('thumbPrefixName', this.thumbPrefixName);

    if (this.isDeleteOldResource !== undefined) {
      form.append('isDeleteOldResource', this.isDeleteOldResource.toString());
    }

    if (this.isDeleteOldThumbnail !== undefined) {
      form.append('isDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }

    if (this.categoryEnum !== undefined) {
      form.append('categoryEnum', this.categoryEnum.toString());
    }

    return form;
  }
}
