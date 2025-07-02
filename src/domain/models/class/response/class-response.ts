import { AttendanceRecordResponse } from '../../attendance/response/attendance-record-response';
import { CategoryResponse } from '../../category/response/category-response';
import { EnrollmentCriteriaResponse } from '../../criteria/response/enrollment-criteria-response';
import { FileClassRelationResponse } from '../../file/response/file-class-relation-response';
import { FileResourcesResponse } from '../../file/response/file-resources-response';

export class ClassResponse {
  id!: string;
  className!: string;
  classDetail?: string;
  duration!: string; // ISO string for TimeSpan equivalent
  locationID?: string;
  teacherID?: string;
  qrCodeURL?: string;
  startAt!: Date;
  endAt!: Date;
  minuteLate!: number;
  classType?: string;
  meetingLink?: string;
  scheduleStatus?: string;
  categoryID?: string;
  category?: CategoryResponse;
  attendanceRecords?: AttendanceRecordResponse[];
  thumbnailID?: string;
  enrollmentCriteria?: EnrollmentCriteriaResponse[];
  thumbnail?: FileResourcesResponse;
  fileClassRelation?: FileClassRelationResponse[];

  constructor(init?: Partial<ClassResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): ClassResponse {
    return new ClassResponse({
      id: json.id,
      className: json.className,
      classDetail: json.classDetail,
      duration: json.duration, // ISO string, e.g., "00:45:00"
      locationID: json.locationID,
      teacherID: json.teacherID,
      qrCodeURL: json.qrCodeURL,
      startAt: json.startAt ? new Date(json.startAt) : undefined,
      endAt: json.endAt ? new Date(json.endAt) : undefined,
      minuteLate: json.minuteLate,
      classType: json.classType,
      meetingLink: json.meetingLink,
      scheduleStatus: json.scheduleStatus,
      categoryID: json.categoryID,
      category: json.category ? CategoryResponse.fromJSON(json.category) : undefined,
      attendanceRecords: json.attendanceRecords?.map((x: any) => AttendanceRecordResponse.fromJson(x)),
      thumbnailID: json.thumbnailID,
      enrollmentCriteria: json.enrollmentCriteria?.map((x: any) => EnrollmentCriteriaResponse.fromJSON(x)),
      thumbnail: json.thumbnail ? FileResourcesResponse.fromJson(json.thumbnail) : undefined,
      fileClassRelation: json.fileClassRelation?.map((x: any) => FileClassRelationResponse.fromJson(x)),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      className: this.className,
      classDetail: this.classDetail,
      duration: this.duration,
      locationID: this.locationID,
      teacherID: this.teacherID,
      qrCodeURL: this.qrCodeURL,
      startAt: this.startAt?.toISOString(),
      endAt: this.endAt?.toISOString(),
      minuteLate: this.minuteLate,
      classType: this.classType,
      meetingLink: this.meetingLink,
      scheduleStatus: this.scheduleStatus,
      categoryID: this.categoryID,
      category: this.category?.toJSON(),
      attendanceRecords: this.attendanceRecords?.map((x) => x.toJson()),
      thumbnailID: this.thumbnailID,
      enrollmentCriteria: this.enrollmentCriteria?.map((x) => x.toJSON()),
      thumbnail: this.thumbnail?.toJson(),
      fileClassRelation: this.fileClassRelation?.map((x) => x.toJson()),
    };
  }
}
