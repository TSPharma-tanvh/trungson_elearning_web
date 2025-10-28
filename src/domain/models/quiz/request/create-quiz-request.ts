import { type CategoryEnum, type QuizInputMethod, QuizTypeEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateQuizRequest {
  levelID?: string;

  canStartOver = false;
  canShuffle = true;
  isRequired = false;

  displayedQuestionCount!: number;

  type: QuizTypeEnum = QuizTypeEnum.LessonQuiz;
  time!: string; // C#: TimeSpan -> "HH:mm:ss"

  maxAttempts!: number;
  scoreToPass!: number;

  title = '';
  description?: string;
  questionIDs?: string; // comma-separated IDs

  categoryID?: string;
  status: StatusEnum = StatusEnum.Enable;

  enrollmentCriteriaIDs?: string;

  thumbnailID?: string;
  resourceIDs?: string; // comma-separated

  resources?: File[];
  resourceDocumentNo?: string;
  resourcePrefixName?: string;

  thumbnail?: File;
  thumbDocumentNo?: string;
  thumbPrefixName?: string;

  categoryEnum?: CategoryEnum;
  isDeleteOldThumbnail?: boolean;

  isAutoSubmitted = true;

  enrollmentCriteriaType?: CategoryEnum;
  enrollmentStatus?: StatusEnum;

  maxCapacity?: number;
  enrollmentCourseIDs?: string;

  // New (Excel-specific properties)
  inputMethod!: QuizInputMethod;
  excelFile?: File;
  questionCategoryID?: string;
  questionCategoryEnum?: CategoryEnum;
  answerCategoryID?: string;
  answerCategoryEnum?: CategoryEnum;

  constructor(init?: Partial<CreateQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CreateQuizRequest {
    const dto = new CreateQuizRequest();
    Object.assign(dto, json);
    return dto;
  }

  toJson(): any {
    return { ...this };
  }

  toFormData(): FormData {
    const formData = new FormData();
    for (const key in this) {
      const value = (this as any)[key];
      if (value === undefined || value === null) continue;

      if (value instanceof Date) {
        formData.append(key, value.toISOString());
      } else if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value) && value[0] instanceof File) {
        value.forEach((file: File) => { formData.append('resources', file); });
      } else {
        formData.append(key, String(value));
      }
    }
    return formData;
  }
}
