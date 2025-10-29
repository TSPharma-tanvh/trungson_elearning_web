import { AttendanceRecordResponse } from '../../attendance/response/attendance-record-response';
import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaClassRelationResponse } from '../../enrollment/response/enrollment-criteria-class-relation-response';
import { FileClassQRRelationResponse } from '../../file/response/file-class-qr-relation-response';
import { FileClassRelationResponse } from '../../file/response/file-class-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';
import { ClassTeacherResponse } from '../../teacher/response/class-teacher-response';

export class ClassResponse {
  id!: string;
  className!: string;
  classDetail?: string;
  duration!: string; // TimeSpan (converted to string)
  isRequired?: boolean;
  locationID?: string;
  teacherID?: string;
  startAt!: Date;
  endAt!: Date;
  minuteLate!: number;
  minuteSoon!: number;
  classType?: string;
  meetingLink?: string;
  scheduleStatus?: string;
  categoryID?: string;
  category?: CategoryResponse;
  attendanceRecords?: AttendanceRecordResponse[];
  thumbnailID?: string;
  thumbnail?: FileResourcesResponse;
  classEnrollments?: EnrollmentCriteriaClassRelationResponse[];
  fileClassQRRelation?: FileClassQRRelationResponse[];
  fileClassRelation?: FileClassRelationResponse[];
  classTeacher?: ClassTeacherResponse;

  constructor(init?: Partial<ClassResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ClassResponse {
    return new ClassResponse({
      id: json.id,
      className: json.className,
      classDetail: json.classDetail,
      duration: json.duration,
      isRequired: json.isRequired,
      locationID: json.locationID,
      teacherID: json.teacherID,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      minuteSoon: json.minuteSoon,
      classType: json.classType,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      categoryID: json.categoryID,
      category: json.category ? CategoryResponse.fromJson(json.category) : undefined,
      attendanceRecords: json.attendanceRecords?.map((x: any) => AttendanceRecordResponse.fromJson(x)),
      thumbnailID: json.thumbnailID,
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      classEnrollments: json.classEnrollments?.map((x: any) => EnrollmentCriteriaClassRelationResponse.fromJson(x)),
      fileClassQRRelation: json.fileClassQRRelation?.map((x: any) => FileClassQRRelationResponse.fromJson(x)),
      fileClassRelation: json.fileClassRelation?.map((x: any) => FileClassRelationResponse.fromJson(x)),
      classTeacher: json.classTeacher ? ClassTeacherResponse.fromJson(json.classTeacher) : undefined,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      className: this.className,
      classDetail: this.classDetail,
      duration: this.duration,
      isRequired: this.isRequired,
      locationID: this.locationID,
      teacherID: this.teacherID,
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
      minuteLate: this.minuteLate,
      minuteSoon: this.minuteSoon,
      classType: this.classType,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      categoryID: this.categoryID,
      category: this.category?.toJson(),
      attendanceRecords: this.attendanceRecords?.map((x) => x.toJson()),
      thumbnailID: this.thumbnailID,
      thumbnail: this.thumbnail?.toJson(),
      classEnrollments: this.classEnrollments?.map((x) => x.toJson()),
      fileClassQRRelation: this.fileClassQRRelation?.map((x) => x.toJson()),
      fileClassRelation: this.fileClassRelation?.map((x) => x.toJson()),
      classTeacher: this.classTeacher?.toJson(),
    };
  }
}
