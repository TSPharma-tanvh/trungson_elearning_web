import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { LessonResponse } from '../../lesson/response/lesson-response';

export class CourseDetailResponse {
  id: string = '';
  pathId?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus?: string;
  teacherId?: string;
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
  fileResources?: FileResourcesResponse[];
  lessons?: LessonResponse[];

  constructor(init?: Partial<CourseDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): CourseDetailResponse {
    return new CourseDetailResponse({
      id: json.id,
      pathId: json.pathId,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,
      teacherId: json.teacherId,
      courseType: json.courseType,
      displayType: json.displayType,
      startTime: json.startTime ? new Date(json.startTime) : undefined,
      endTime: json.endTime ? new Date(json.endTime) : undefined,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      enrollmentCriteria: json.enrollmentCriteria?.map((ec: any) => EnrollmentCriteriaResponse.fromJSON(ec)),
      categoryId: json.categoryId,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileResources: json.fileResources?.map((f: any) => FileResourcesResponse.fromJson(f)),
      lessons: json.lessons?.map((l: any) => LessonResponse.fromJSON(l)),
    });
  }

  toJSON(): any {
    return {
      id: this.id,
      pathId: this.pathId,
      detail: this.detail,
      isRequired: this.isRequired,
      name: this.name,
      disableStatus: this.disableStatus,
      teacherId: this.teacherId,
      courseType: this.courseType,
      displayType: this.displayType,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteria: this.enrollmentCriteria?.map((ec) => ec.toJSON()),
      categoryId: this.categoryId,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      fileResources: this.fileResources?.map((f) => f.toJson()),
      lessons: this.lessons?.map((l) => l.toJSON()),
    };
  }
}
