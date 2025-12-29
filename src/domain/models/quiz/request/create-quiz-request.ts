import { DateTimeUtils } from '@/utils/date-time-utils';
import { QuizTypeEnum, StatusEnum, type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateQuizRequest {
  levelID?: string;

  canStartOver = false;
  canShuffle = true;
  isRequired = false;
  hasLesson = false;
  lessonID?: string;

  // displayedQuestionCount!: number;

  type: QuizTypeEnum = QuizTypeEnum.LessonQuiz;
  time!: string; // HH:mm:ss

  isRestrictAttempts = false;
  maxAttempts?: number;

  title = '';
  description?: string;

  positionStateCode?: string;
  departmentTypeCode?: string;

  categoryID?: string;
  status: StatusEnum = StatusEnum.Enable;

  thumbnailID?: string;
  resourceIDs?: string;

  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;

  categoryEnum?: CategoryEnum;
  isDeleteOldThumbnail?: boolean;

  isAutoSubmitted = true;

  isFixedQuiz = false;

  startDate?: Date;
  endDate?: Date;

  fixedQuizDayDuration?: number;
  positionCode?: string;

  questionCategoryConfigs: QuizCategoryConfigCreate[] = [];

  constructor(init?: Partial<CreateQuizRequest>) {
    Object.assign(this, init);

    if (init?.questionCategoryConfigs) {
      this.questionCategoryConfigs = init.questionCategoryConfigs.map((x) => new QuizCategoryConfigCreate(x));
    }
  }

  static fromJson(json: any): CreateQuizRequest {
    return new CreateQuizRequest({
      ...json,
      questionCategoryConfigs: json.questionCategoryConfigs?.map((x: any) => QuizCategoryConfigCreate.fromJson(x)),
    });
  }

  toJson(): any {
    return {
      ...this,
      questionCategoryConfigs: this.questionCategoryConfigs.map((x) => x.toJson()),
      startDate: this.startDate ? DateTimeUtils.formatISODateToString(this.startDate) : undefined,
      endDate: this.endDate ? DateTimeUtils.formatISODateToString(this.endDate) : undefined,
    };
  }

  toFormData(): FormData {
    const formData = new FormData();

    Object.entries(this).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (key.endsWith('Enum')) return;

      if (key === 'questionCategoryConfigs') {
        formData.append(
          'QuestionCategoryConfigs',
          JSON.stringify(value.map((x: QuizCategoryConfigCreate) => x.toJson()))
        );
        return;
      }

      if (value instanceof Date) {
        formData.append(key, DateTimeUtils.formatISODateToString(value)!);
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file) => formData.append('Resources', file));
        return;
      }

      formData.append(key, String(value));
    });

    return formData;
  }
}

export class QuizCategoryConfigCreate {
  categoryID!: string;
  displayedQuestionCount!: number;
  order = 0;

  constructor(init?: Partial<QuizCategoryConfigCreate>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): QuizCategoryConfigCreate {
    return new QuizCategoryConfigCreate({
      categoryID: json.categoryID,
      displayedQuestionCount: json.displayedQuestionCount,
      order: json.order ?? 0,
    });
  }

  toJson(): any {
    return {
      categoryID: this.categoryID,
      displayedQuestionCount: this.displayedQuestionCount,
      order: this.order,
    };
  }
}
