import { type CategoryEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateFileResourcesRequest {
  ids!: string;
  files!: File[];
  documentNo?: string;
  prefixName?: string;
  status?: StatusEnum;
  categoryID?: string;
  categoryEnum?: CategoryEnum;
  userID?: string;

  constructor(data?: Partial<UpdateFileResourcesRequest>) {
    Object.assign(this, data);
  }

  static fromJson(json: any): UpdateFileResourcesRequest {
    return new UpdateFileResourcesRequest({
      ids: json.ids,
      files: json.files || [],
      documentNo: json.documentNo,
      prefixName: json.prefixName,
      status: json.status,
      categoryID: json.categoryID,
      categoryEnum: json.categoryEnum,
      userID: json.userID,
    });
  }

  toJson(): any {
    return {
      ids: this.ids,
      documentNo: this.documentNo,
      prefixName: this.prefixName,
      status: this.status,
      categoryID: this.categoryID,
      categoryEnum: this.categoryEnum,
      userID: this.userID,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();
    formData.append('Ids', this.ids);
    this.files.forEach((f) => { formData.append('Files', f); });
    if (this.documentNo) formData.append('DocumentNo', this.documentNo);
    if (this.prefixName) formData.append('PrefixName', this.prefixName);
    if (this.status !== undefined) formData.append('Status', this.status.toString());
    if (this.categoryID) formData.append('CategoryID', this.categoryID);
    if (this.categoryEnum !== undefined) formData.append('CategoryEnum', this.categoryEnum.toString());
    if (this.userID) formData.append('UserID', this.userID);
    return formData;
  }
}
