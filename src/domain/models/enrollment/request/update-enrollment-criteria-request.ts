import { StatusEnum } from '@/utils/enum/core-enum';

export class UpdateEnrollmentCriteriaRequest {
  id = '';
  name?: string;
  desc?: string;
  enrollmentStatus?: StatusEnum;
  isDefault?: boolean;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;

  constructor(init?: Partial<UpdateEnrollmentCriteriaRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateEnrollmentCriteriaRequest {
    return new UpdateEnrollmentCriteriaRequest({
      id: json.id ?? '',
      name: json.name,
      desc: json.desc,
      enrollmentStatus: json.enrollmentStatus
        ? StatusEnum[json.enrollmentStatus as keyof typeof StatusEnum]
        : undefined,
      isDefault: json.isDefault,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      enrollmentStatus: this.enrollmentStatus,
      isDefault: this.isDefault,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
