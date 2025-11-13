export class CategoryResponseNoThumbnail {
  id?: string;
  categoryName?: string;
  description?: string;
  category?: string;
  thumbnailId?: string;

  static fromJson(json: any): CategoryResponseNoThumbnail {
    const obj = new CategoryResponseNoThumbnail();
    obj.id = json.id;
    obj.categoryName = json.categoryName;
    obj.description = json.description;
    obj.category = json.category;
    obj.thumbnailId = json.thumbnailId;
    return obj;
  }

  toJson(): any {
    return {
      id: this.id,
      categoryName: this.categoryName,
      description: this.description,
      category: this.category,
      thumbnailId: this.thumbnailId,
    };
  }
}
