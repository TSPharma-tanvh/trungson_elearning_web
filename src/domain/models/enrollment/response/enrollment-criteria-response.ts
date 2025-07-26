export class EnrollmentCriteriaResponse {
  id = '';
  name?: string;
  desc?: string;
  targetType = '';
  disableStatus?: string;
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: number;
  targetPharmacyID?: string;

  constructor(init?: Partial<EnrollmentCriteriaResponse>) {
    Object.assign(this, init);
  }

  static fromJSON(json: any): EnrollmentCriteriaResponse {
    return new EnrollmentCriteriaResponse({
      id: json.id,
      name: json.name,
      desc: json.desc,
      targetType: json.targetType,
      disableStatus: json.disableStatus,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJSON(): any {
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
    };
  }
}
