import { type CategoryEnum, type StatusEnum } from '@/utils/enum/core-enum';

export class UpdateEnrollmentCriteriaRequest {
  id = '';
  name?: string;
  desc?: string;
  enrollmentStatus?: StatusEnum;
  enrollmentCriteriaType?: CategoryEnum;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;

  constructor(init?: Partial<UpdateEnrollmentCriteriaRequest>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): UpdateEnrollmentCriteriaRequest {
    return new UpdateEnrollmentCriteriaRequest(json);
  }

  toJson(): any {
    return {
      id: this.id,
      name: this.name,
      desc: this.desc,
      enrollmentStatus: this.enrollmentStatus,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
