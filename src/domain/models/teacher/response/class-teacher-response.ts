import { ClassResponse } from '../../class/response/class-response';
import { CourseDetailResponse } from '../../courses/response/course-detail-response';
import { UserDetailResponse } from '../../user/response/user-detail-response';

export class ClassTeacherResponse {
  id = '';
  userID?: string;
  description?: string;
  status?: string;
  user?: UserDetailResponse;
  courses?: CourseDetailResponse[];
  classes?: ClassResponse[];
  createdDateTime!: string;
  updatedDateTime?: string;

  constructor(init?: Partial<ClassTeacherResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ClassTeacherResponse {
    return new ClassTeacherResponse({
      id: json.id ?? json.Id ?? '',
      userID: json.userID ?? json.UserID,
      description: json.description ?? json.Description,
      status: json.status ?? json.Status,
      user: json.user ? UserDetailResponse.fromJson(json.user) : undefined,
      courses: Array.isArray(json.courses) ? json.courses.map((c: any) => CourseDetailResponse.fromJson(c)) : undefined,
      classes: Array.isArray(json.classes) ? json.classes.map((cl: any) => ClassResponse.fromJson(cl)) : undefined,
      createdDateTime: json.createdDateTime ?? json.CreatedDateTime ?? '',
      updatedDateTime: json.updatedDateTime ?? json.UpdatedDateTime,
    });
  }

  toJson(): any {
    return {
      Id: this.id,
      UserID: this.userID,
      Description: this.description,
      Status: this.status,
      User: this.user?.toJson(),
      Courses: this.courses?.map((c) => c.toJson()),
      Classes: this.classes?.map((cl) => cl.toJson()),
      CreatedDateTime: this.createdDateTime,
      UpdatedDateTime: this.updatedDateTime,
    };
  }
}
