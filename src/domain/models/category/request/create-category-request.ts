import { CategoryEnum } from '@/utils/enum/core-enum';

export class CreateCategoryRequest {
  categoryName: string;
  description?: string | undefined;
  category: CategoryEnum;
  thumbnailID?: string | undefined;
  thumbnail?: File | undefined;
  thumbDocumentNo?: string | undefined;
  thumbPrefixName?: string | undefined;
  isDeleteOldThumbnail?: boolean | undefined;

  constructor(data: Partial<CreateCategoryRequest> = {}) {
    this.categoryName = data.categoryName ?? '';
    this.description = data.description;
    this.category = data.category ?? CategoryEnum.Criteria;
    this.thumbnailID = data.thumbnailID;
    this.thumbnail = data.thumbnail;
    this.thumbDocumentNo = data.thumbDocumentNo;
    this.thumbPrefixName = data.thumbPrefixName;
    this.isDeleteOldThumbnail = data.isDeleteOldThumbnail;
  }

  static fromJSON(json: any): CreateCategoryRequest {
    return new CreateCategoryRequest({
      categoryName: json.categoryName,
      description: json.description,
      category: json.category ? CategoryEnum[json.category as keyof typeof CategoryEnum] : undefined,
      thumbnailID: json.thumbnailID,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
    });
  }

  toJSON(): any {
    return {
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnailID: this.thumbnailID,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('categoryName', this.categoryName);
    if (this.description !== undefined) {
      formData.append('description', this.description);
    }
    formData.append('category', this.category.toString());
    if (this.thumbnailID !== undefined) {
      formData.append('thumbnailID', this.thumbnailID);
    }
    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }
    if (this.thumbDocumentNo !== undefined) {
      formData.append('thumbDocumentNo', this.thumbDocumentNo);
    }
    if (this.thumbPrefixName !== undefined) {
      formData.append('thumbPrefixName', this.thumbPrefixName);
    }
    if (this.isDeleteOldThumbnail !== undefined) {
      formData.append('isDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }
    return formData;
  }
}
