import { type QuizTypeEnum } from '@/utils/enum/core-enum';

export class GetQuizRequest {
  lessonID?: string;
  levelID?: string;

  canStartOver?: boolean;
  isRequired?: boolean;

  type?: QuizTypeEnum;

  minTime?: string;
  maxTime?: string;

  title?: string;
  description?: string;

  hasImage?: boolean;
  hasLesson?: boolean;

  isAutoSubmitted?: boolean;

  // NEW fields from .NET
  positionCode?: string;
  positionStateCode?: string;
  departmentTypeCode?: string;

  isFixedQuiz?: boolean;

  searchText?: string;

  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): GetQuizRequest {
    const dto = new GetQuizRequest();
    Object.assign(dto, json);
    return dto;
  }

  toJson(): any {
    return {
      ...this,
    };
  }
}
