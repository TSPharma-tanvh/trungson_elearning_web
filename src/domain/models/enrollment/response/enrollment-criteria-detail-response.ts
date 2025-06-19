import { ClassResponse } from '../../class/response/class-response';
import { EnrollmentResponse } from '../../class/response/enrollment-response';

export class EnrollmentCriteriaDetailResponse {
  id?: string;
  name?: string;
  desc?: string;
  targetType?: string;
  disableStatus?: string;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;
  enrollments?: EnrollmentResponse[];
  classes?: ClassResponse[];

  constructor(init?: Partial<EnrollmentCriteriaDetailResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaDetailResponse {
    return new EnrollmentCriteriaDetailResponse({
      id: json.id,
      name: json.name,
      desc: json.desc,
      targetType: json.targetType,
      disableStatus: json.disableStatus,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
      enrollments: json.enrollments?.map((e: any) => EnrollmentResponse.fromJson(e)),
      classes: json.classes?.map((c: any) => ClassResponse.fromJson(c)),
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      targetType: this.targetType,
      disableStatus: this.disableStatus,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
      enrollments: this.enrollments?.map((e) => e.toJson()),
      classes: this.classes?.map((c) => c.toJson()),
    };
  }
}
