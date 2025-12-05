import { CourseDetailResponse } from '../../courses/response/course-detail-response';
import { LessonResponse } from './lesson-response';

export class LessonsCollectionDetailResponse {
  id = '';
  name = '';
  order = 0;
  startDate?: string;
  endDate?: string;
  fixedCourseDayDuration?: number;
  courseID?: string;
  lessons: LessonResponse[] = [];
  course?: CourseDetailResponse;

  constructor(init?: Partial<LessonsCollectionDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): LessonsCollectionDetailResponse {
    return new LessonsCollectionDetailResponse({
      id: json.id,
      name: json.name,
      order: json.order,
      startDate: json.startDate,
      endDate: json.endDate,
      fixedCourseDayDuration: json.fixedCourseDayDuration,
      courseID: json.courseID,
      lessons: json.lessons?.map((l: any) => LessonResponse.fromJson(l)) ?? [],
      course: json.course ? CourseDetailResponse.fromJson(json.course) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      order: this.order,
      startDate: this.startDate,
      endDate: this.endDate,
      fixedCourseDayDuration: this.fixedCourseDayDuration,
      courseID: this.courseID,
      lessons: this.lessons.map((l) => l.toJson()),
      course: this.course?.toJson(),
    };
  }
}
