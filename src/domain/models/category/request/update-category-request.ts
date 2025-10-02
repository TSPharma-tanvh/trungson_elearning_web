import { CategoryEnum } from '@/utils/enum/core-enum';

export class UpdateCategoryRequest {
  id: string;
  categoryName?: string | null;
  description?: string | null;
  category?: CategoryEnum | null;
  thumbnailID?: string | null;
  thumbnail?: File | null;
  thumbDocumentNo?: string | null;
  thumbPrefixName?: string | null;
  isDeleteOldThumbnail?: boolean | null;

  constructor(data: Partial<UpdateCategoryRequest> = {}) {
    this.id = data.id ?? '';
    this.categoryName = data.categoryName;
    this.description = data.description;
    this.category = data.category;
    this.thumbnailID = data.thumbnailID;
    this.thumbnail = data.thumbnail;
    this.thumbDocumentNo = data.thumbDocumentNo;
    this.thumbPrefixName = data.thumbPrefixName;
    this.isDeleteOldThumbnail = data.isDeleteOldThumbnail;
  }

  static fromJson(json: any): UpdateCategoryRequest {
    return new UpdateCategoryRequest({
      id: json.id,
      categoryName: json.categoryName,
      description: json.description,
      category: json.category ? CategoryEnum[json.category as keyof typeof CategoryEnum] : undefined,
      thumbnailID: json.thumbnailID,
      thumbDocumentNo: json.thumbDocumentNo,
      thumbPrefixName: json.thumbPrefixName,
      isDeleteOldThumbnail: json.isDeleteOldThumbnail,
    });
  }

  toJson(): any {
    return {
      id: this.id,
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

    formData.append('id', this.id);

    if (this.categoryName !== null && this.categoryName !== undefined) {
      formData.append('categoryName', this.categoryName);
    }
    if (this.description !== null && this.description !== undefined) {
      formData.append('description', this.description);
    }
    if (this.category !== null && this.category !== undefined) {
      formData.append('category', this.category.toString());
    }

    if (this.thumbnailID !== null && this.thumbnailID !== undefined) {
      formData.append('thumbnailID', this.thumbnailID);
    }

    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }

    if (this.thumbDocumentNo !== null && this.thumbDocumentNo !== undefined) {
      formData.append('thumbDocumentNo', this.thumbDocumentNo);
    }

    if (this.thumbPrefixName !== null && this.thumbPrefixName !== undefined) {
      formData.append('thumbPrefixName', this.thumbPrefixName);
    }

    if (this.isDeleteOldThumbnail !== null && this.isDeleteOldThumbnail !== undefined) {
      formData.append('isDeleteOldThumbnail', this.isDeleteOldThumbnail.toString());
    }

    return formData;
  }
}
