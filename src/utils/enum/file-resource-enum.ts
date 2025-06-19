export enum FileResourceEnum {
  Image = 'Image',
  Video = 'Video',
  Document = 'Document',
  Other = 'Other',
}

export class FileResourceEnumUtils {
  static getFileResourceEnum(contentType: string): FileResourceEnum {
    if (contentType.startsWith('image/')) {
      return FileResourceEnum.Image;
    }

    if (contentType.startsWith('video/')) {
      return FileResourceEnum.Video;
    }

    if (
      contentType.startsWith('application/pdf') ||
      contentType.startsWith('application/msword') ||
      contentType.startsWith('application/vnd')
    ) {
      return FileResourceEnum.Document;
    }

    return FileResourceEnum.Other;
  }

  static getContentTypeByEnum(type: FileResourceEnum): string {
    switch (type) {
      case FileResourceEnum.Image:
        return 'image';
      case FileResourceEnum.Video:
        return 'video';
      case FileResourceEnum.Document:
        return 'application';
      default:
        return '';
    }
  }
}
