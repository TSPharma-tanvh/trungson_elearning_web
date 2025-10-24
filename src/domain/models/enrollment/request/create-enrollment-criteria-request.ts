import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateEnrollmentCriteriaRequest {
  name: string;
  desc?: string;
  enrollmentStatus: StatusEnum;
  enrollmentCriteriaType: CategoryEnum;
  isDefault: boolean;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity: number;
  targetPharmacyID?: string;

  constructor(data: Partial<CreateEnrollmentCriteriaRequest>) {
    this.name = data.name ?? '';
    this.desc = data.desc;
    this.enrollmentStatus = data.enrollmentStatus ?? StatusEnum.Enable;
    this.enrollmentCriteriaType = data.enrollmentCriteriaType ?? CategoryEnum.Criteria;
    this.isDefault = data.isDefault ?? false;
    this.targetID = data.targetID;
    this.targetLevelID = data.targetLevelID;
    this.maxCapacity = data.maxCapacity ?? 0;
    this.targetPharmacyID = data.targetPharmacyID;
  }

  static fromJson(json: any): CreateEnrollmentCriteriaRequest {
    return new CreateEnrollmentCriteriaRequest({
      name: json.name,
      desc: json.desc,
      enrollmentStatus: json.enrollmentStatus
        ? StatusEnum[json.enrollmentStatus as keyof typeof StatusEnum]
        : StatusEnum.Enable,
      enrollmentCriteriaType: json.enrollmentCriteriaType
        ? CategoryEnum[json.enrollmentCriteriaType as keyof typeof CategoryEnum]
        : CategoryEnum.Criteria,
      isDefault: json.isDefault ?? false,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJson(): any {
    return {
      name: this.name,
      desc: this.desc,
      enrollmentStatus: this.enrollmentStatus,
      enrollmentCriteriaType: this.enrollmentCriteriaType,
      isDefault: this.isDefault,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
