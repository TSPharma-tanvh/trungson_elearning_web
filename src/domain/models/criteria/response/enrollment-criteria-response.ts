export class EnrollmentCriteriaResponse {
  id: string = '';
  targetType: string = '';
  targetID?: string;
  targetLevelID?: string;
  maxCapacity?: string;
  targetPharmacyID?: string;

  constructor(init?: Partial<EnrollmentCriteriaResponse>) {
    Object.assign(this, init);
  }

  static fromJson(json: any): EnrollmentCriteriaResponse {
    return new EnrollmentCriteriaResponse({
      id: json.id,
      targetType: json.targetType,
      targetID: json.targetID,
      targetLevelID: json.targetLevelID,
      maxCapacity: json.maxCapacity,
      targetPharmacyID: json.targetPharmacyID,
    });
  }

  toJson(): any {
    return {
      id: this.id,
      targetType: this.targetType,
      targetID: this.targetID,
      targetLevelID: this.targetLevelID,
      maxCapacity: this.maxCapacity,
      targetPharmacyID: this.targetPharmacyID,
    };
  }
}
