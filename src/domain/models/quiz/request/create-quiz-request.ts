import { CategoryEnum, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateQuizRequest {
  levelID?: string;

  canStartOver: boolean = false;
  canShuffle: boolean = true;
  isRequired: boolean = false;

  displayedQuestionCount!: number;

  type: QuizTypeEnum = QuizTypeEnum.LessonQuiz;
  time!: string; // TimeSpan to string (HH:mm:ss)

  isRestrictAttempts: boolean = false;

  maxAttempts!: number;
  scoreToPass!: number;

  title: string = '';
  description?: string;

  positionStateCode?: string;
  departmentTypeCode?: string;

  categoryID!: string;
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

  isAutoSubmitted: boolean = true;

  questionCategoryIDs?: string;

  isFixedQuiz: boolean = false;

  startDate?: Date;
  endDate?: Date;

  fixedQuizDayDuration?: number;

  positionCode?: string;

  //new logic
  inputMethod?: string;
  excelFile?: File;
  questionCategoryID?: string;
  questionCategoryEnum?: CategoryEnum;
  answerCategoryID?: string;
  answerCategoryEnum?: CategoryEnum;

  constructor(init?: Partial<CreateQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateQuizRequest {
    return new CreateQuizRequest({ ...json });
  }

  toJson(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();

    Object.entries(this).forEach(([key, value]: [string, any]) => {
      if (value === undefined || value === null) return;

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
        value.forEach((file) => formData.append('resources', file));
      } else {
        formData.append(key, String(value));
      }
    });

    return formData;
  }
}
