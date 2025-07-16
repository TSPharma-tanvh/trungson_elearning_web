import { CategoryEnum } from '@/utils/enum/core-enum';

export class CreateCategoryRequest {
  categoryName: string;
  description?: string | null;
  category: CategoryEnum;
  thumbnailID?: string | null;
  thumbnail?: File | null;
  thumbDocumentNo?: string | null;
  thumbPrefixName?: string | null;
  isDeleteOldThumbnail?: boolean | null;

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
    if (this.description != null) {
      formData.append('description', this.description);
    }
    formData.append('category', this.category.toString());
    if (this.thumbnailID != null) {
      formData.append('thumbnailID', this.thumbnailID);
    }
    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }
    if (this.thumbDocumentNo != null) {
      formData.append('thumbDocumentNo', this.thumbDocumentNo);
    }
    if (this.thumbPrefixName != null) {
      formData.append('thumbPrefixName', this.thumbPrefixName);
    }
    if (this.isDeleteOldThumbnail != null) {
      formData.append('isDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }
    return formData;
  }
}
