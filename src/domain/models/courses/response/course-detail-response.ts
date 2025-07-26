import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { LessonResponse } from '../../lessons/response/lesson-response';
import { CoursePathResponse } from '../../path/response/course-path-response';
import { ClassTeacherResponse } from '../../teacher/response/class-teacher-response';

export class CourseDetailResponse {
  id = '';
  pathId?: string;
  coursePath?: CoursePathResponse;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: string;
  teacherId?: string;
  classTeacher?: ClassTeacherResponse;
  courseType?: string;
  displayType?: string;
  startTime?: Date;
  endTime?: Date;
  meetingLink?: string;
  scheduleStatus!: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse[];
  categoryId?: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  fileCourseRelation?: FileResourcesResponse[];
  lessons?: LessonResponse[];
  category?: CategoryResponse;

  constructor(init?: Partial<CourseDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CourseDetailResponse {
    return new CourseDetailResponse({
      id: json.id,
      pathId: json.pathId,
      coursePath: json.coursePath ? CoursePathResponse.fromJson(json.coursePath) : undefined,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,
      teacherId: json.teacherId,
      classTeacher: json.classTeacher ? ClassTeacherResponse.fromJson(json.classTeacher) : undefined,
      courseType: json.courseType,
      displayType: json.displayType,
      startTime: json.startTime ? new Date(json.startTime) : undefined,
      endTime: json.endTime ? new Date(json.endTime) : undefined,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      enrollmentCriteria: json.enrollmentCriteria?.map((e: any) => EnrollmentCriteriaResponse.fromJSON(e)),
      categoryId: json.categoryId,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileCourseRelation: json.fileCourseRelation?.map((f: any) => FileResourcesResponse.fromJson(f)),
      lessons: json.lessons?.map((l: any) => LessonResponse.fromJSON(l)),
      category: json.thumbnail ? CategoryResponse.fromJSON(json.thumbnail) : undefined,
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      pathId: this.pathId,
      coursePath: this.coursePath?.toJson(),
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,
      teacherId: this.teacherId,
      classTeacher: this.classTeacher?.toJson(),
      courseType: this.courseType,
      displayType: this.displayType,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteria: this.enrollmentCriteria?.map((e) => e.toJSON()),
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      fileCourseRelation: this.fileCourseRelation?.map((f) => f.toJson()),
      lessons: this.lessons?.map((l) => l.toJSON()),
      category: this.category?.toJSON(),
    };
  }
}
