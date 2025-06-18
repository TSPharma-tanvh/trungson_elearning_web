import { CategoryDetailResponse } from '../../category/response/category-detail-response';
import { CourseResponse } from '../../courses/response/course-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class CoursePathResponse {
  id?: string;
  name?: string;
  detail?: string;
  isRequired?: boolean;
  startTime?: string;
  endTime?: string;
  status?: string;
  displayType?: string;
  categoryID?: string;
  thumbnailID?: string;
  enrollmentCriteriaID?: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse;
  category?: CategoryDetailResponse;
  thumbnail?: FileResourcesResponse;
  courses: CourseResponse[] = [];

  static fromJson(json: any): CoursePathResponse {
    const dto = new CoursePathResponse();
    dto.id = json.id;
    dto.name = json.name;
    dto.detail = json.detail;
    dto.isRequired = json.isRequired;
    dto.startTime = json.startTime;
    dto.endTime = json.endTime;
    dto.status = json.status;
    dto.displayType = json.displayType;
    dto.categoryID = json.categoryID;
    dto.thumbnailID = json.thumbnailID;
    dto.enrollmentCriteriaID = json.enrollmentCriteriaID;
    dto.enrollmentCriteria = json.enrollmentCriteria
      ? EnrollmentCriteriaResponse.fromJSON(json.enrollmentCriteria)
      : undefined;
    dto.category = json.category ? CategoryDetailResponse.fromJson(json.category) : undefined;
    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;
    dto.courses = Array.isArray(json.courses) ? json.courses.map((c: any) => CourseResponse.fromJson(c)) : [];
    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      detail: this.detail,
      isRequired: this.isRequired,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.status,
      displayType: this.displayType,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      enrollmentCriteriaID: this.enrollmentCriteriaID,
      enrollmentCriteria: this.enrollmentCriteria?.toJSON(),
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      courses: this.courses.map((c) => c.toJson()),
    };
  }
}
