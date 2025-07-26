import { type QuizTypeEnum } from '@/utils/enum/core-enum';

export class GetQuizRequest {
  lessonID?: string;
  levelID?: string;
  canStartOver?: boolean;
  isRequired?: boolean;
  type?: QuizTypeEnum;
  minTime?: string;
  maxTime?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  endTimeFrom?: Date;
  endTimeTo?: Date;
  title?: string;
  description?: string;
  hasImage?: boolean;
  hasLesson?: boolean;
  isAutoSubmitted?: boolean;
  searchText?: string;
  pageNumber = 1;
  pageSize = 10;

  constructor(init?: Partial<GetQuizRequest>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): GetQuizRequest {
    const dto = new GetQuizRequest();
    Object.assign(dto, json);
    dto.startDateFrom = json.startDateFrom ? new Date(json.startDateFrom) : undefined;
    dto.startDateTo = json.startDateTo ? new Date(json.startDateTo) : undefined;
    dto.endTimeFrom = json.endTimeFrom ? new Date(json.endTimeFrom) : undefined;
    dto.endTimeTo = json.endTimeTo ? new Date(json.endTimeTo) : undefined;
    return dto;
  }

  toJSON(): any {
    return {
      ...this,
      startDateFrom: this.startDateFrom?.toISOString(),
      startDateTo: this.startDateTo?.toISOString(),
      endTimeFrom: this.endTimeFrom?.toISOString(),
      endTimeTo: this.endTimeTo?.toISOString(),
    };
  }
}
