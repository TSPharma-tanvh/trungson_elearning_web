export class FileResourcesResponse {
  id?: string;
  type?: string;
  resourceUrl?: string;
  deleteUrl?: string;
  status?: string;
  tagID?: string;
  name?: string;
  size: number = 0;

  static fromJson(json: any): FileResourcesResponse {
    const dto = new FileResourcesResponse();
    dto.id = json.id;
    dto.type = json.type;
    dto.resourceUrl = json.resourceUrl;
    dto.deleteUrl = json.deleteUrl;
    dto.status = json.status;
    dto.tagID = json.tagID;
    dto.name = json.name;
    dto.size = json.size ?? 0;
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      type: this.type,
      resourceUrl: this.resourceUrl,
      deleteUrl: this.deleteUrl,
      status: this.status,
      tagID: this.tagID,
      name: this.name,
      size: this.size,
    };
  }
}
