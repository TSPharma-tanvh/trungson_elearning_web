import { type CategoryEnum } from '@/utils/enum/core-enum';

import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class CategoryDetailResponse {
  id?: string;
  categoryName?: string;
  description?: string;
  category?: CategoryEnum;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;

  static fromJson(json: any): CategoryDetailResponse {
    const dto = new CategoryDetailResponse();
    dto.id = json.id;
    dto.categoryName = json.categoryName;
    dto.description = json.description;
    dto.category = json.category;
    dto.thumbnailId = json.thumbnailId;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
    };
  }
}
