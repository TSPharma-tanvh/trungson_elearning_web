export class CreateLessonCollectionRequest {
  name: string;
  order: number;
  startDate?: Date;
  endDate?: Date;
  fixedCourseDayDuration?: number;
  lessonIds: string[];

  constructor(init?: Partial<CreateLessonCollectionRequest>) {
    this.name = init?.name || '';
    this.order = init?.order || 0;
    this.startDate = init?.startDate;
    this.endDate = init?.endDate;
    this.fixedCourseDayDuration = init?.fixedCourseDayDuration;
    this.lessonIds = init?.lessonIds || [];
  }

  static fromJson(json: any): CreateLessonCollectionRequest {
    return new CreateLessonCollectionRequest({
      name: json.name,
      order: json.order,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      fixedCourseDayDuration: json.fixedCourseDayDuration,
      lessonIds: json.lessonIds || [],
    });
  }

  toJson(): any {
    return {
      name: this.name,
      order: this.order,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      fixedCourseDayDuration: this.fixedCourseDayDuration,
      lessonIds: this.lessonIds,
    };
  }

  toFormData(prefix: string = ''): FormData {
    const formData = new FormData();
    const key = (k: string) => (prefix ? `${prefix}.${k}` : k);

    formData.append(key('name'), this.name);
    formData.append(key('order'), this.order.toString());
    if (this.startDate) formData.append(key('startDate'), this.startDate.toISOString());
    if (this.endDate) formData.append(key('endDate'), this.endDate.toISOString());
    if (this.fixedCourseDayDuration !== undefined)
      formData.append(key('fixedCourseDayDuration'), this.fixedCourseDayDuration.toString());
    formData.append(key('lessonIds'), JSON.stringify(this.lessonIds));

    return formData;
  }
}
