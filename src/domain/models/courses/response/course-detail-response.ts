import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaCourseRelationResponse } from '../../enrollment/response/enrollment-criteria-course-relation-response';
import { FileCourseRelationResponse } from '../../file/response/file-course-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { LessonsCollectionDetailResponse } from '../../lessons/response/lesson-collection-detail-response';
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

  meetingLink?: string;

  scheduleStatus!: string;

  courseEnrollments?: EnrollmentCriteriaCourseRelationResponse[];

  categoryId?: string;
  category?: CategoryResponse;

  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;

  fileCourseRelation?: FileCourseRelationResponse[];

  collections: LessonsCollectionDetailResponse[] = [];

  positionStateCode?: string;

  isFixedCourse!: boolean;

  departmentTypeCode?: string;
  positionCode?: string;

  positionStateName?: string;
  departmentTypeName?: string;
  positionName?: string;

  constructor(init?: Partial<CourseDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CourseDetailResponse {
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
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      courseEnrollments: json.courseEnrollments?.map((e: any) => EnrollmentCriteriaCourseRelationResponse.fromJson(e)),
      categoryId: json.categoryId,
      category: json.category ? CategoryResponse.fromJson(json.category) : undefined,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileCourseRelation: json.fileCourseRelation?.map((f: any) => FileCourseRelationResponse.fromJson(f)),

      // NEW: parse collections
      collections: json.collections?.map((c: any) => LessonsCollectionDetailResponse.fromJson(c)) ?? [],

      positionStateCode: json.positionStateCode,
      isFixedCourse: json.isFixedCourse,
      positionCode: json.positionCode,
      departmentTypeCode: json.departmentTypeCode,

      positionStateName: json.positionStateName,
      positionName: json.positionName,
      departmentTypeName: json.departmentTypeName,
    });
  }

  toJson(): any {
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
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      courseEnrollments: this.courseEnrollments?.map((e) => e.toJson()),
      categoryId: this.categoryId,
      category: this.category?.toJson(),
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      fileCourseRelation: this.fileCourseRelation?.map((f) => f.toJson()),

      // NEW
      collections: this.collections.map((c) => c.toJson()),

      positionStateCode: this.positionStateCode,
      isFixedCourse: this.isFixedCourse,
      positionCode: this.positionCode,
      departmentTypeCode: this.departmentTypeCode,

      positionStateName: this.positionStateName,
      positionName: this.positionName,
      departmentTypeName: this.departmentTypeName,
    };
  }
}
