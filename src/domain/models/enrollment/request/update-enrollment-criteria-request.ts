import { CategoryEnum, StatusEnum } from '@/utils/enum/core-enum';





export class UpdateEnrollmentCriteriaRequest {
  id: string = '';
  name?: string;
  desc?: string;
  enrollmentStatus?: StatusEnum;
  enrollmentCriteriaType?: CategoryEnum;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;

  constructor(
    id?: string,
    name?: string,
    desc?: string,
    enrollmentStatus?: StatusEnum,
    enrollmentCriteriaType?: CategoryEnum,
    targetID?: string,
    targetLevelID?: string,
    maxCapacity?: number,
    targetPharmacyID?: string
  ) {
    this.id = id ?? '';
    this.name = name;
    this.desc = desc;
    this.enrollmentStatus = enrollmentStatus;
    this.enrollmentCriteriaType = enrollmentCriteriaType;
    this.targetID = targetID;
    this.targetLevelID = targetLevelID;
    this.maxCapacity = maxCapacity;
    this.targetPharmacyID = targetPharmacyID;
  }

  static fromJSON(json: any): UpdateEnrollmentCriteriaRequest {
    return new UpdateEnrollmentCriteriaRequest(
      json.id,
      json.name,
      json.desc,
      json.enrollmentStatus,
      json.enrollmentCriteriaType,
      json.targetID,
      json.targetLevelID,
      json.maxCapacity,
      json.targetPharmacyID
    );
  }

  toJSON(): any {
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