export enum FileResourceEnum {
  Image = 'Image',
  Video = 'Video',
  Document = 'Document',
  Other = 'Other',
}

export const FileResourceEnumUtils = {
  getFileResourceEnum(contentType: string): FileResourceEnum {
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
  },

  getContentTypeByEnum(type: FileResourceEnum): string {
    switch (type) {
      case FileResourceEnum.Image:
        return 'image';
      case FileResourceEnum.Video:
        return 'video';
      case FileResourceEnum.Document:
        return 'document';
      default:
        return '';
    }
  },
};

export enum FileTypeEnum {
  Image = 0,
  Video = 1,
  PDF = 2,
  PPT = 3,
  Others = 4,
}

export const FileTypeEnumUtils = {
  getFileTypeEnum(contentType: string): FileTypeEnum {
    const ct = contentType.toLowerCase();

    if (ct.startsWith('image/')) {
      return FileTypeEnum.Image;
    }
    if (ct.startsWith('video/')) {
      return FileTypeEnum.Video;
    }
    if (ct === 'application/pdf') {
      return FileTypeEnum.PDF;
    }
    if (
      ct.includes('powerpoint') ||
      ct.includes('presentation') ||
      ct === 'application/vnd.ms-powerpoint' ||
      ct === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      ct === 'application/vnd.openxmlformats-officedocument.presentationml.slideshow'
    ) {
      return FileTypeEnum.PPT;
    }

    return FileTypeEnum.Others;
  },

  getAcceptAttribute(type: FileTypeEnum): string {
    switch (type) {
      case FileTypeEnum.Image:
        return 'image/*';
      case FileTypeEnum.Video:
        return 'video/*';
      case FileTypeEnum.PDF:
        return 'application/pdf';
      case FileTypeEnum.PPT:
        return '.ppt,.pptx,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.*';
      case FileTypeEnum.Others:
        return '*';
      default:
        return '*';
    }
  },

  getLabel(type: FileTypeEnum, t?: (key: string) => string): string {
    const translator = t || ((key: string) => key);

    switch (type) {
      case FileTypeEnum.Image:
        return translator('image');
      case FileTypeEnum.Video:
        return translator('video');
      case FileTypeEnum.PDF:
        return translator('pdf');
      case FileTypeEnum.PPT:
        return translator('ppt');
      case FileTypeEnum.Others:
        return translator('others');
      default:
        return translator('unknown');
    }
  },

  getIconName(type: FileTypeEnum): string {
    switch (type) {
      case FileTypeEnum.Image:
        return 'Image';
      case FileTypeEnum.Video:
        return 'VideoCamera';
      case FileTypeEnum.PDF:
        return 'FilePdf';
      case FileTypeEnum.PPT:
        return 'FilePpt';
      case FileTypeEnum.Others:
        return 'File';
      default:
        return 'File';
    }
  },
};

export enum FileUploadAdminEnum {
  Files,
  Video,
}
