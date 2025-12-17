import { type StatusEnum } from '@/utils/enum/core-enum';

import { CategoryResponseNoThumbnail } from '../../category/response/category-response-no-thumbnail-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';
import { FileClassRelationResponseForResource } from './file-class-relation-response-for-resource';
import { FileClassQRRelationResponseForResource } from './file-classqr-relation-response-for-resource';
import { FileCourseRelationResponseForResource } from './file-course-relation-response-for-resource';
import { FileLessonRelationResponseForResource } from './file-lesson-relation-response-for-resource';
import { FileQuestionRelationResponseForResource } from './file-question-relation-response-for-resource';
import { FileQuizRelationResponseForResources } from './file-quiz-relation-response-for-resources';

export class FileResourcesResponseForAdmin {
  id?: string;
  type?: string;
  resourceUrl?: string;
  status?: StatusEnum;
  tagID?: string;
  name?: string;
  size: number = 0;
  isThumbnail?: boolean;
  categoryID?: string;
  category?: CategoryResponseNoThumbnail;

  fileClassQRRelation: FileClassQRRelationResponseForResource[] = [];
  fileClassRelation: FileClassRelationResponseForResource[] = [];
  fileCourseRelation: FileCourseRelationResponseForResource[] = [];
  fileLessonRelation: FileLessonRelationResponseForResource[] = [];
  fileQuestionRelation: FileQuestionRelationResponseForResource[] = [];
  fileQuizRelation: FileQuizRelationResponseForResources[] = [];

  createdByUser?: UserDetailResponse;
  updatedByUser?: UserDetailResponse;

  constructor(init?: Partial<FileResourcesResponseForAdmin>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileResourcesResponseForAdmin {
    if (!json) return new FileResourcesResponseForAdmin();

    return new FileResourcesResponseForAdmin({
      id: json.id,
      type: json.type,
      resourceUrl: json.resourceUrl,
      status: json.status,
      tagID: json.tagID,
      name: json.name,
      size: json.size ?? 0,
      isThumbnail: json.isThumbnail,
      categoryID: json.categoryID,
      category: json.category ? CategoryResponseNoThumbnail.fromJson(json.category) : undefined,

      fileClassQRRelation: (json.fileClassQRRelation ?? []).map((x: any) =>
        FileClassQRRelationResponseForResource.fromJson(x)
      ),
      fileClassRelation: (json.fileClassRelation ?? []).map((x: any) =>
        FileClassRelationResponseForResource.fromJson(x)
      ),
      fileCourseRelation: (json.fileCourseRelation ?? []).map((x: any) =>
        FileCourseRelationResponseForResource.fromJson(x)
      ),
      fileLessonRelation: (json.fileLessonRelation ?? []).map((x: any) =>
        FileLessonRelationResponseForResource.fromJson(x)
      ),
      fileQuestionRelation: (json.fileQuestionRelation ?? []).map((x: any) =>
        FileQuestionRelationResponseForResource.fromJson(x)
      ),
      fileQuizRelation: (json.fileQuizRelation ?? []).map((x: any) => FileQuizRelationResponseForResources.fromJson(x)),

      createdByUser: json.createdByUser ? UserDetailResponse.fromJson(json.createdByUser) : undefined,
      updatedByUser: json.updatedByUser ? UserDetailResponse.fromJson(json.updatedByUser) : undefined,
    });
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
      category: this.category?.toJson(),

      fileClassQRRelation: this.fileClassQRRelation.map((x) => x.toJson()),
      fileClassRelation: this.fileClassRelation.map((x) => x.toJson()),
      fileCourseRelation: this.fileCourseRelation.map((x) => x.toJson()),
      fileLessonRelation: this.fileLessonRelation.map((x) => x.toJson()),
      fileQuestionRelation: this.fileQuestionRelation.map((x) => x.toJson()),
      fileQuizRelation: this.fileQuizRelation.map((x) => x.toJson()),

      createdByUser: this.createdByUser?.toJson(),
      updatedByUser: this.updatedByUser?.toJson(),
    };
  }
}
