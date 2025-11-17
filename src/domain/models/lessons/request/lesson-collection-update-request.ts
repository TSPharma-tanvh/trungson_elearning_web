export class LessonsCollectionUpdateRequest {
  id!: string;
  name!: string;
  order!: number;
  startDate?: Date;
  endDate?: Date;
  fixedCourseDayDuration?: number;
  lessonIds: string[] = [];

  constructor(init?: Partial<LessonsCollectionUpdateRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): LessonsCollectionUpdateRequest {
    return new LessonsCollectionUpdateRequest({
      id: json.id,
      name: json.name,
      order: json.order,
      startDate: json.startDate ? new Date(json.startDate) : undefined,
      endDate: json.endDate ? new Date(json.endDate) : undefined,
      fixedCourseDayDuration: json.fixedCourseDayDuration,
      lessonIds: json.lessonIds ?? [],
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
      lessonIds: this.lessonIds,
    };
  }
}
