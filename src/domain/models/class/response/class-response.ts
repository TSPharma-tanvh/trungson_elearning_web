import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class ClassResponse {
  id?: string;
  pathId?: string;
  detail?: string;
  isRequired?: boolean;
  name?: string;
  disableStatus!: number;
  teacherId?: string;
  courseType!: number;
  displayType!: number;
  imageId?: string;
  startTime?: Date;
  endTime?: Date;
  meetingLink?: string;
  scheduleStatus!: number;
  enrollmentCriteriaId?: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse;
  categoryId?: string;
  categoryName?: string;
  pathName?: string;
  thumbnailId?: string;
  thumbnail?: FileResourcesResponse;
  fileResources?: FileResourcesResponse[];

  constructor(init?: Partial<ClassResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ClassResponse {
    return new ClassResponse({
      id: json.id,
      pathId: json.pathId,
      detail: json.detail,
      isRequired: json.isRequired,
      name: json.name,
      disableStatus: json.disableStatus,
      teacherId: json.teacherId,
      courseType: json.courseType,
      displayType: json.displayType,
      imageId: json.imageId,
      startTime: json.startTime ? new Date(json.startTime) : undefined,
      endTime: json.endTime ? new Date(json.endTime) : undefined,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      enrollmentCriteriaId: json.enrollmentCriteriaId,
      enrollmentCriteria: json.enrollmentCriteria
        ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
        : undefined,
      categoryId: json.categoryId,
      categoryName: json.categoryName,
      pathName: json.pathName,
      thumbnailId: json.thumbnailId,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileResources: json.fileResources?.map((f: any) => FileResourcesResponse.fromJson(f)),
    });
  }

  toJson(): any {
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
      imageId: this.imageId,
      startTime: this.startTime?.toISOString(),
      endTime: this.endTime?.toISOString(),
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      enrollmentCriteriaId: this.enrollmentCriteriaId,
      enrollmentCriteria: this.enrollmentCriteria?.toJSON(),
      categoryId: this.categoryId,
      categoryName: this.categoryName,
      pathName: this.pathName,
      thumbnailId: this.thumbnailId,
      thumbnail: this.thumbnail?.toJson(),
      fileResources: this.fileResources?.map((f) => f.toJson()),
    };
  }
}
