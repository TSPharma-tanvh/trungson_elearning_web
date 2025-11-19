export class LessonsCollectionUpdateDetailRequest {
  lessonId!: string;
  order!: number;

  constructor(init?: Partial<LessonsCollectionUpdateDetailRequest>) {
    this.lessonId = init?.lessonId || '';
    this.order = init?.order || 0;
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

export class LessonsCollectionUpdateRequest {
  id!: string;
  name!: string;
  order!: number;
  startDate?: Date;
  endDate?: Date;
  fixedCourseDayDuration?: number;
  collection: LessonsCollectionUpdateDetailRequest[] = [];

  constructor(init?: Partial<LessonsCollectionUpdateRequest>) {
    this.id = init?.id || '';
    this.name = init?.name || '';
    this.order = init?.order || 0;
    this.startDate = init?.startDate;
    this.endDate = init?.endDate;
    this.fixedCourseDayDuration = init?.fixedCourseDayDuration;
    this.collection = init?.collection?.map((c) => new LessonsCollectionUpdateDetailRequest(c)) || [];
  }

  static fromJson(json: any): LessonsCollectionUpdateRequest {
    return new LessonsCollectionUpdateRequest({
      id: json.id,
      name: json.name,
      order: json.order,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      fixedCourseDayDuration: json.fixedCourseDayDuration,
      collection: json.collection?.map((x: any) => LessonsCollectionUpdateDetailRequest.fromJson(x)),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      startDate: this.startDate?.toISOString(),
      endDate: this.endDate?.toISOString(),
      fixedCourseDayDuration: this.fixedCourseDayDuration,
      collection: this.collection.map((c) => c.toJson()),
    };
  }

  toFormData(prefix = ''): FormData {
    const formData = new FormData();
    const key = (k: string) => (prefix ? `${prefix}.${k}` : k);

    formData.append(key('Id'), this.id);
    formData.append(key('Name'), this.name);
    formData.append(key('Order'), this.order.toString());

    if (this.startDate) formData.append(key('StartDate'), this.startDate.toISOString());
    if (this.endDate) formData.append(key('EndDate'), this.endDate.toISOString());
    if (this.fixedCourseDayDuration !== undefined)
      formData.append(key('FixedCourseDayDuration'), this.fixedCourseDayDuration.toString());

    // Collection items
    this.collection.forEach((item, index) => {
      const itemPrefix = `${key('Collection')}[${index}]`;
      formData.append(`${itemPrefix}.LessonId`, item.lessonId);
      formData.append(`${itemPrefix}.Order`, item.order.toString());
    });

    return formData;
  }
}
