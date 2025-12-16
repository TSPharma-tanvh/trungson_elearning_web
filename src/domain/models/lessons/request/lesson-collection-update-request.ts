import { DateTimeUtils } from '@/utils/date-time-utils';

export class LessonsCollectionUpdateDetailRequest {
  lessonId!: string;
  order!: number;

  constructor(init?: Partial<LessonsCollectionUpdateDetailRequest>) {
    this.lessonId = init?.lessonId ?? '';
    this.order = init?.order ?? 0;
  }

  static fromJson(json: any): LessonsCollectionUpdateDetailRequest {
    return new LessonsCollectionUpdateDetailRequest({
      lessonId: json.lessonId,
      order: json.order,
    });
  }

  toJson(): any {
    return {
      lessonId: this.lessonId,
      order: this.order,
    };
  }
}

export class QuizzesCollectionUpdateDetailRequest {
  quizId!: string;
  order!: number;

  constructor(init?: Partial<QuizzesCollectionUpdateDetailRequest>) {
    this.quizId = init?.quizId ?? '';
    this.order = init?.order ?? 0;
  }

  static fromJson(json: any): QuizzesCollectionUpdateDetailRequest {
    return new QuizzesCollectionUpdateDetailRequest({
      quizId: json.quizId,
      order: json.order,
    });
  }

  toJson(): any {
    return {
      quizId: this.quizId,
      order: this.order,
    };
  }
}

export class LessonsCollectionUpdateRequest {
  id!: string;
  name!: string;
  order!: number;

  startDate?: Date;
  endDate?: Date;
  fixedCourseDayDuration?: number;

  lessons: LessonsCollectionUpdateDetailRequest[] = [];
  quizzes?: QuizzesCollectionUpdateDetailRequest[];

  constructor(init?: Partial<LessonsCollectionUpdateRequest>) {
    this.id = init?.id ?? '';
    this.name = init?.name ?? '';
    this.order = init?.order ?? 0;

    this.startDate = init?.startDate;
    this.endDate = init?.endDate;
    this.fixedCourseDayDuration = init?.fixedCourseDayDuration;

    this.lessons = init?.lessons?.map((x) => new LessonsCollectionUpdateDetailRequest(x)) ?? [];

    this.quizzes = init?.quizzes?.map((x) => new QuizzesCollectionUpdateDetailRequest(x));
  }

  static fromJson(json: any): LessonsCollectionUpdateRequest {
    return new LessonsCollectionUpdateRequest({
      id: json.id,
      name: json.name,
      order: json.order,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      fixedCourseDayDuration: json.fixedCourseDayDuration,
      lessons: json.lessons?.map((x: any) => LessonsCollectionUpdateDetailRequest.fromJson(x)),
      quizzes: json.quizzes?.map((x: any) => QuizzesCollectionUpdateDetailRequest.fromJson(x)),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      startDate: this.startDate ? DateTimeUtils.formatISODateToString(this.startDate) : undefined,
      endDate: this.endDate ? DateTimeUtils.formatISODateToString(this.endDate) : undefined,
      fixedCourseDayDuration: this.fixedCourseDayDuration,
      lessons: this.lessons.map((l) => l.toJson()),
      quizzes: this.quizzes?.map((q) => q.toJson()),
    };
  }

  toFormData(prefix = ''): FormData {
    const formData = new FormData();
    const key = (k: string) => (prefix ? `${prefix}.${k}` : k);

    formData.append(key('Id'), this.id);
    formData.append(key('Name'), this.name);
    formData.append(key('Order'), this.order.toString());

    if (this.startDate) formData.append(key('StartDate'), DateTimeUtils.formatISODateToString(this.startDate)!);

    if (this.endDate) formData.append(key('EndDate'), DateTimeUtils.formatISODateToString(this.endDate)!);

    if (this.fixedCourseDayDuration !== undefined)
      formData.append(key('FixedCourseDayDuration'), this.fixedCourseDayDuration.toString());

    // Lessons
    this.lessons.forEach((item, index) => {
      const p = `${key('Lessons')}[${index}]`;
      formData.append(`${p}.LessonId`, item.lessonId);
      formData.append(`${p}.Order`, item.order.toString());
    });

    // Quizzes
    this.quizzes?.forEach((item, index) => {
      const p = `${key('Quizzes')}[${index}]`;
      formData.append(`${p}.QuizId`, item.quizId);
      formData.append(`${p}.Order`, item.order.toString());
    });

    return formData;
  }
}
