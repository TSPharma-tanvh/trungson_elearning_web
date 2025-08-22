import { QuizTypeEnum, StatusEnum, type CategoryEnum } from '@/utils/enum/core-enum';

export class CreateQuizRequest {
  lessonID?: string;
  levelID?: string;
  canStartOver = false;
  canShuffle = true;
  isRequired = false;
  type: QuizTypeEnum = QuizTypeEnum.LessonQuiz;
  time!: string; // TimeSpan as string: "00:30:00"
  maxAttempts?: number;
  title = '';
  description?: string;
  questionIDs?: string;
  categoryID?: string;
  status?: StatusEnum = StatusEnum.Enable;
  enrollmentCriteriaIDs?: string;
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
  isAutoSubmitted?: boolean = true;
  enrollmentCriteriaType?: CategoryEnum;
  enrollmentStatus?: StatusEnum;
  totalScore?: number;
  enrollmentCourseIDs?: string;

  constructor(init?: Partial<CreateQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CreateQuizRequest {
    const dto = new CreateQuizRequest();
    Object.assign(dto, json);
    return dto;
  }

  toJSON(): any {
    return {
      ...this,
    };
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
        value.forEach((file: File) => {
          formData.append('resources', file);
        });
      } else {
        formData.append(key, String(value));
      }
    }
    return formData;
  }
}
