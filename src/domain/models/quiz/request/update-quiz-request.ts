import { type CategoryEnum, type QuizTypeEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateQuizRequest {
  id!: string;
  lessonID?: string;
  levelID?: string;
  canStartOver?: boolean;
  canShuffle?: boolean;
  isRequired?: boolean;
  type?: QuizTypeEnum;
  time?: string; // TimeSpan as ISO string or "HH:mm:ss"
  maxAttempts?: number;
  title?: string;
  description?: string;
  questionIDs?: string;
  categoryID?: string;
  status?: StatusEnum;
  enrollmentCriteriaIDs?: string;
  thumbnailID?: string;
  resourceIDs?: string;
  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;
  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;
  isDeleteOldThumbnail?: boolean;
  categoryEnum?: CategoryEnum;
  isAutoSubmitted?: boolean = true;
  enrollmentCriteriaType?: CategoryEnum;
  enrollmentStatus?: StatusEnum;
  totalScore?: number;
  enrollmentCourseIDs?: string;
  scoreToPass?: number;

  constructor(init?: Partial<UpdateQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateQuizRequest {
    const dto = new UpdateQuizRequest();
    Object.assign(dto, json);
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      lessonID: this.lessonID,
      levelID: this.levelID,
      canStartOver: this.canStartOver,
      canShuffle: this.canShuffle,
      isRequired: this.isRequired,
      type: this.type,
      time: this.time,
      title: this.title,
      description: this.description,
      questionIDs: this.questionIDs,
      categoryID: this.categoryID,
      status: this.status,
      enrollmentCriteriaIDs: this.enrollmentCriteriaIDs,
      thumbnailID: this.thumbnailID,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,
      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,
      categoryEnum: this.categoryEnum,
      isAutoSubmitted: this.isAutoSubmitted,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      enrollmentStatus: this.enrollmentStatus,
      totalScore: this.totalScore,
      enrollmentCourseIDs: this.enrollmentCourseIDs,
      scoreToPass: this.scoreToPass,

      // Files (thumbnail, resources) excluded here
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    const appendIfExists = (key: string, value: unknown) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    };

    appendIfExists('id', this.id);
    appendIfExists('lessonID', this.lessonID);
    appendIfExists('levelID', this.levelID);
    appendIfExists('canStartOver', this.canStartOver);
    appendIfExists('canShuffle', this.canShuffle);
    appendIfExists('isRequired', this.isRequired);
    appendIfExists('type', this.type);
    appendIfExists('time', this.time);
    appendIfExists('maxAttempts', this.maxAttempts);
    appendIfExists('title', this.title);
    appendIfExists('description', this.description);
    appendIfExists('questionIDs', this.questionIDs);
    appendIfExists('categoryID', this.categoryID);
    appendIfExists('status', this.status);
    appendIfExists('enrollmentCriteriaIDs', this.enrollmentCriteriaIDs);
    appendIfExists('thumbnailID', this.thumbnailID);
    appendIfExists('resourceIDs', this.resourceIDs);
    appendIfExists('resourceDocumentNo', this.resourceDocumentNo);
    appendIfExists('resourcePrefixName', this.resourcePrefixName);
    appendIfExists('thumbDocumentNo', this.thumbDocumentNo);
    appendIfExists('thumbPrefixName', this.thumbPrefixName);
    appendIfExists('isDeleteOldThumbnail', this.isDeleteOldThumbnail);
    appendIfExists('categoryEnum', this.categoryEnum);
    appendIfExists('isAutoSubmitted', this.isAutoSubmitted);
    appendIfExists('enrollmentCriteriaType', this.enrollmentCriteriaType);
    appendIfExists('enrollmentStatus', this.enrollmentStatus);
    appendIfExists('totalScore', this.totalScore);
    appendIfExists('enrollmentCourseIDs', this.enrollmentCourseIDs);
    appendIfExists('scoreToPass', this.scoreToPass);

    if (this.thumbnail) {
      formData.append('thumbnail', this.thumbnail);
    }

    if (this.resources?.length) {
      this.resources.forEach((file) => {
        formData.append('resources', file);
      });
    }

    return formData;
  }
}
