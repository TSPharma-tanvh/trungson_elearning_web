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
  time?: string; // HH:mm:ss

  startTime?: string;
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
  startDate?: string;
  endDate?: string;
  fixedQuizDayDuration?: number;

  positionCode?: string;
  isRestrictAttempts?: boolean;

  questionCategoryConfigs?: QuizCategoryConfigUpdate[];

  constructor(init?: Partial<UpdateQuizRequest>) {
    Object.assign(this, init);

    if (init?.questionCategoryConfigs) {
      this.questionCategoryConfigs = init.questionCategoryConfigs.map((x) => new QuizCategoryConfigUpdate(x));
    }
  }

  static fromJson(json: any): UpdateQuizRequest {
    return new UpdateQuizRequest({
      ...json,
      questionCategoryConfigs: json.questionCategoryConfigs?.map((x: any) => QuizCategoryConfigUpdate.fromJson(x)),
    });
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

      questionCategoryConfigs: this.questionCategoryConfigs?.map((x) => x.toJson()),
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    const append = (key: string, value: any) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    };

    append('Id', this.id);

    append('LessonID', this.lessonID);
    append('LevelID', this.levelID);

    append('CanStartOver', this.canStartOver);
    append('CanShuffle', this.canShuffle);
    append('DisplayedQuestionCount', this.displayedQuestionCount);
    append('IsRequired', this.isRequired);

    append('Type', this.type);
    append('Time', this.time);
    append('StartTime', this.startTime);
    append('EndTime', this.endTime);

    append('MaxAttempts', this.maxAttempts);

    append('Title', this.title);
    append('Description', this.description);

    append('PositionStateCode', this.positionStateCode);
    append('DepartmentTypeCode', this.departmentTypeCode);

    append('CategoryID', this.categoryID);
    append('Status', this.status);

    append('ThumbnailID', this.thumbnailID);
    append('ResourceIDs', this.resourceIDs);

    append('ResourceDocumentNo', this.resourceDocumentNo);
    append('ResourcePrefixName', this.resourcePrefixName);

    append('ThumbDocumentNo', this.thumbDocumentNo);
    append('ThumbPrefixName', this.thumbPrefixName);

    append('IsDeleteOldThumbnail', this.isDeleteOldThumbnail);
    append('CategoryEnum', this.categoryEnum);
    append('IsAutoSubmitted', this.isAutoSubmitted);

    append('IsFixedQuiz', this.isFixedQuiz);
    append('StartDate', this.startDate);
    append('EndDate', this.endDate);
    append('FixedQuizDayDuration', this.fixedQuizDayDuration);

    append('PositionCode', this.positionCode);
    append('IsRestrictAttempts', this.isRestrictAttempts);

    if (this.questionCategoryConfigs?.length) {
      formData.append('QuestionCategoryConfigs', JSON.stringify(this.questionCategoryConfigs.map((x) => x.toJson())));
    }

    if (this.thumbnail) {
      formData.append('Thumbnail', this.thumbnail);
    }

    if (this.resources?.length) {
      this.resources.forEach((file) => {
        formData.append('Resources', file);
      });
    }

    return formData;
  }
}

export class QuizCategoryConfigUpdate {
  id!: string;
  categoryID!: string;
  displayedQuestionCount!: number;
  order = 0;

  constructor(init?: Partial<QuizCategoryConfigUpdate>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuizCategoryConfigUpdate {
    return new QuizCategoryConfigUpdate({
      id: json.id,
      categoryID: json.categoryID,
      displayedQuestionCount: json.displayedQuestionCount,
      order: json.order ?? 0,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      categoryID: this.categoryID,
      displayedQuestionCount: this.displayedQuestionCount,
      order: this.order,
    };
  }
}
