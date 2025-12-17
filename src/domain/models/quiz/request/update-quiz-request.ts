import { type CategoryEnum, type QuizTypeEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateQuizRequest {
  id!: string;
  lessonID?: string;
  levelID?: string;
  canStartOver?: boolean;
  canShuffle?: boolean;
  displayedQuestionCount?: number;
  isRequired?: boolean;
  type?: QuizTypeEnum;
  time?: string; // TimeSpan as "HH:mm:ss"
  startTime?: string; // C# DateTime? string
  endTime?: string;
  maxAttempts?: number;
  // scoreToPass?: number;

  title?: string;
  description?: string;

  positionStateCode?: string;
  departmentTypeCode?: string;

  categoryID?: string;
  status?: StatusEnum;

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

  isFixedQuiz?: boolean;
  startDate?: string; // DateTime?
  endDate?: string;
  fixedQuizDayDuration?: number;

  positionCode?: string;

  isRestrictAttempts?: boolean;
  questionCategoryIDs?: string;

  constructor(init?: Partial<UpdateQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateQuizRequest {
    return new UpdateQuizRequest(json);
  }

  toJson(): any {
    return {
      id: this.id,
      lessonID: this.lessonID,
      levelID: this.levelID,
      canStartOver: this.canStartOver,
      canShuffle: this.canShuffle,
      displayedQuestionCount: this.displayedQuestionCount,
      isRequired: this.isRequired,
      type: this.type,
      time: this.time,
      startTime: this.startTime,
      endTime: this.endTime,
      maxAttempts: this.maxAttempts,
      // scoreToPass: this.scoreToPass,

      title: this.title,
      description: this.description,

      positionStateCode: this.positionStateCode,
      departmentTypeCode: this.departmentTypeCode,

      categoryID: this.categoryID,
      status: this.status,
      thumbnailID: this.thumbnailID,
      resourceIDs: this.resourceIDs,
      resourceDocumentNo: this.resourceDocumentNo,
      resourcePrefixName: this.resourcePrefixName,

      thumbDocumentNo: this.thumbDocumentNo,
      thumbPrefixName: this.thumbPrefixName,
      isDeleteOldThumbnail: this.isDeleteOldThumbnail,

      categoryEnum: this.categoryEnum,
      isAutoSubmitted: this.isAutoSubmitted,

      isFixedQuiz: this.isFixedQuiz,
      startDate: this.startDate,
      endDate: this.endDate,
      fixedQuizDayDuration: this.fixedQuizDayDuration,

      positionCode: this.positionCode,
      isRestrictAttempts: this.isRestrictAttempts,
      questionCategoryIDs: this.questionCategoryIDs,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    const append = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    };

    append('id', this.id);
    append('lessonID', this.lessonID);
    append('levelID', this.levelID);
    append('canStartOver', this.canStartOver);
    append('canShuffle', this.canShuffle);
    append('displayedQuestionCount', this.displayedQuestionCount);
    append('isRequired', this.isRequired);
    append('type', this.type);
    append('time', this.time);
    append('startTime', this.startTime);
    append('endTime', this.endTime);
    append('maxAttempts', this.maxAttempts);
    // append('scoreToPass', this.scoreToPass);

    append('title', this.title);
    append('description', this.description);

    append('positionStateCode', this.positionStateCode);
    append('departmentTypeCode', this.departmentTypeCode);

    append('categoryID', this.categoryID);
    append('status', this.status);

    append('thumbnailID', this.thumbnailID);
    append('resourceIDs', this.resourceIDs);

    append('resourceDocumentNo', this.resourceDocumentNo);
    append('resourcePrefixName', this.resourcePrefixName);

    append('thumbDocumentNo', this.thumbDocumentNo);
    append('thumbPrefixName', this.thumbPrefixName);

    append('isDeleteOldThumbnail', this.isDeleteOldThumbnail);

    append('categoryEnum', this.categoryEnum);
    append('isAutoSubmitted', this.isAutoSubmitted);

    append('isFixedQuiz', this.isFixedQuiz);
    append('startDate', this.startDate);
    append('endDate', this.endDate);
    append('fixedQuizDayDuration', this.fixedQuizDayDuration);

    append('positionCode', this.positionCode);

    append('isRestrictAttempts', this.isRestrictAttempts);
    append('questionCategoryIDs', this.questionCategoryIDs);

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
