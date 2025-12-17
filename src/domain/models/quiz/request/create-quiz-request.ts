import { DateTimeUtils } from '@/utils/date-time-utils';
import { QuizTypeEnum, StatusEnum, type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateQuizRequest {
  levelID?: string;

  canStartOver = false;
  canShuffle = true;
  isRequired = false;
  hasLesson = false;
  lessonID?: string;

  displayedQuestionCount!: number;

  type: QuizTypeEnum = QuizTypeEnum.LessonQuiz;
  time!: string; // HH:mm:ss

  isRestrictAttempts = false;

  maxAttempts?: number;
  // scoreToPass!: number;

  title = '';
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

  isAutoSubmitted = true;

  isFixedQuiz = false;

  startDate?: Date;
  endDate?: Date;

  fixedQuizDayDuration?: number;
  positionCode?: string;

  // new logic
  // inputMethod?: string;
  // excelFile?: File;

  // questionCategoryEnum?: CategoryEnum;
  // answerCategoryEnum?: CategoryEnum;

  // NEW FIELDS ADDED
  // questionCategoryID?: string;
  // answerCategoryID?: string;
  questionCategoryIDs?: string;

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

      // Skip enums when uploading
      if (key.endsWith('Enum')) return;

      if (value instanceof Date) {
        formData.append(key, DateTimeUtils.formatISODateToString(value)!);
        return;
      }

      if (value instanceof File) {
        formData.append(key, value);
        return;
      }

      // resources array
      if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
        value.forEach((f) => {
          formData.append('resources', f);
        });
        return;
      }

      formData.append(key, String(value));
    });

    return formData;
  }
}
