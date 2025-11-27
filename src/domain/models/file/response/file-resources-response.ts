import { CategoryResponseNoThumbnail } from '../../category/response/category-response-no-thumbnail-response';

export class FileResourcesResponse {
  id = '';
  type?: string;
  resourceUrl?: string;
  status?: string;
  tagID?: string;
  name?: string;
  size?: number;
  isThumbnail?: boolean;
  categoryID?: string;
  category?: CategoryResponseNoThumbnail;

  static fromJson(json: any): FileResourcesResponse {
    const obj = new FileResourcesResponse();
    obj.id = json.id ?? '';
    obj.type = json.type;
    obj.resourceUrl = json.resourceUrl;
    obj.status = json.status;
    obj.tagID = json.tagID;
    obj.name = json.name;
    obj.size = json.size;
    obj.isThumbnail = json.isThumbnail;
    obj.categoryID = json.categoryID;
    obj.category = json.category ? CategoryResponseNoThumbnail.fromJson(json.category) : undefined;
    return obj;
  }

  toJson(): any {
    return {
      id: this.id,
      type: this.type,
      resourceUrl: this.resourceUrl,
      status: this.status,
      tagID: this.tagID,
      name: this.name,
      size: this.size,
      isThumbnail: this.isThumbnail,
      categoryID: this.categoryID,
      category: this.category ? this.category.toJson() : undefined,
    };
  }
}
