import { CategoryDetailResponse } from '../../category/response/category-detail-response';
import { CourseResponse } from '../../courses/response/course-response';
import { EnrollmentCriteriaPathRelationResponse } from '../../enrollment/response/enrollment-criteria-path-relation-response-dto';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { UserPathProgressResponse } from '../../user-path/response/user-path-progress-response';

export class CoursePathResponse {
  id?: string;
  name?: string;
  detail?: string;
  isRequired?: boolean;
  status?: string;
  displayType?: string;
  courses?: CourseResponse[];
  categoryID?: string;
  thumbnailID?: string;
  pathEnrollments?: EnrollmentCriteriaPathRelationResponse[];
  category?: CategoryDetailResponse;
  thumbnail?: FileResourcesResponse;
  userPathProgress?: UserPathProgressResponse[];

  constructor(init?: Partial<CoursePathResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): CoursePathResponse {
    const dto = new CoursePathResponse();
    dto.id = json.id;
    dto.name = json.name;
    dto.detail = json.detail;
    dto.isRequired = json.isRequired;
    dto.status = json.status;
    dto.displayType = json.displayType;
    dto.categoryID = json.categoryID;
    dto.thumbnailID = json.thumbnailID;

    dto.courses = Array.isArray(json.courses) ? json.courses.map((c: any) => CourseResponse.fromJson(c)) : [];

    dto.pathEnrollments = Array.isArray(json.pathEnrollments)
      ? json.pathEnrollments.map((p: any) => EnrollmentCriteriaPathRelationResponse.fromJson(p))
      : undefined;

    dto.category = json.category ? CategoryDetailResponse.fromJson(json.category) : undefined;

    dto.thumbnail = json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined;

    dto.userPathProgress = Array.isArray(json.userPathProgress)
      ? json.userPathProgress.map((u: any) => UserPathProgressResponse.fromJson(u))
      : undefined;

    return dto;
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      detail: this.detail,
      isRequired: this.isRequired,
      status: this.status,
      displayType: this.displayType,
      categoryID: this.categoryID,
      thumbnailID: this.thumbnailID,
      courses: this.courses?.map((c) => c.toJson()),
      pathEnrollments: this.pathEnrollments?.map((p) => p.toJson()),
      category: this.category?.toJson(),
      thumbnail: this.thumbnail?.toJson(),
      userPathProgress: this.userPathProgress?.map((u) => u.toJson()),
    };
  }
}
