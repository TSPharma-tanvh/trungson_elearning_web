import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';

export class CreateEnrollmentCriteriaRequest {
  name: string;
  desc?: string;
  enrollmentStatus: StatusEnum;
  enrollmentCriteriaType: CategoryEnum;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity: number;
  targetPharmacyID?: string;

  constructor(
    name: string,
    maxCapacity: number,
    desc?: string,
    enrollmentStatus: StatusEnum = StatusEnum.Enable,
    enrollmentCriteriaType: CategoryEnum = CategoryEnum.Criteria,
    targetID?: string,
    targetLevelID?: string,
    targetPharmacyID?: string
  ) {
    this.name = name;
    this.desc = desc;
    this.enrollmentStatus = enrollmentStatus;
    this.enrollmentCriteriaType = enrollmentCriteriaType;
    this.targetID = targetID;
    this.targetLevelID = targetLevelID;
    this.maxCapacity = maxCapacity;
    this.targetPharmacyID = targetPharmacyID;
  }

  static fromJSON(json: any): CreateEnrollmentCriteriaRequest {
    return new CreateEnrollmentCriteriaRequest(
      json.name,
      json.maxCapacity,
      json.desc,
      json.enrollmentStatus,
      json.enrollmentCriteriaType,
      json.targetID,
      json.targetLevelID,
      json.targetPharmacyID
    );
  }

  toJSON(): any {
    return {
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
