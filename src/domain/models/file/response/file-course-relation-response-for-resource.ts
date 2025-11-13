import { CourseDetailResponse } from '../../courses/response/course-detail-response';
import { CourseResponse } from '../../courses/response/course-response';

export class FileCourseRelationResponseForResource {
  id?: string;
  courseId?: string;
  fileResourceId?: string;
  course?: CourseResponse;

  constructor(init?: Partial<FileCourseRelationResponseForResource>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): FileCourseRelationResponseForResource {
    if (!json) return new FileCourseRelationResponseForResource();
    return new FileCourseRelationResponseForResource({
      id: json.id,
      courseId: json.courseId,
      fileResourceId: json.fileResourceId,
      course: json.course ? CourseResponse.fromJson(json.course) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      courseId: this.courseId,
      fileResourceId: this.fileResourceId,
      course: this.course?.toJson(),
    };
  }
}
